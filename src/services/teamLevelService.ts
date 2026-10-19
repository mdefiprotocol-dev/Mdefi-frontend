/**
 * MDeFi Team Levels 2–10: read-only on-chain traversal helper.
 * Does not modify the HUB contract or replace the existing Level 1 implementation.
 * Uses ethers v6 + existing HUB_ABI / CONTRACT_ADDRESSES.
 */
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, HUB_ABI } from '../config/contractConfig';

const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
const MULTICALL3_ABI = [
  'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[] returnData)',
];
const BATCH_SIZE = 40;
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 250;
const ZERO = ethers.ZeroAddress.toLowerCase();

type UserNode = {
  id: string;
  registrationTime: number;
  isBlocked: boolean;
  isRegistered: boolean;
  wallet: string;
  upline: string;
  directTeam: string[];
  totalTeam: string;
};

export type TeamLevelResult = {
  level: number;
  members: UserNode[];
  complete: boolean;
  failedWallets: string[];
  /** Number of unique nodes whose getUserNode result was read successfully. */
  nodesRead: number;
};

type CacheEntry = { node: UserNode; blockNumber: number };
const nodeCache = new Map<string, CacheEntry>();
const levelCache = new Map<string, TeamLevelResult>();
const inflight = new Map<string, Promise<TeamLevelResult>>();
const verifiedMulticall = new Map<string, boolean>();

const normAddress = (value: unknown): string | null => {
  if (typeof value !== 'string' || !ethers.isAddress(value)) return null;
  const normalized = ethers.getAddress(value).toLowerCase();
  return normalized === ZERO ? null : normalized;
};
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const scopedKey = (chainId: bigint | number, hub: string, wallet: string) =>
  `${String(chainId)}:${hub.toLowerCase()}:${wallet.toLowerCase()}`;
const nodeKey = (scope: string, wallet: string) => `${scope}:node:${wallet.toLowerCase()}`;
const levelKey = (scope: string, level: number) => `${scope}:level:${level}`;

function decodeNode(raw: any, requestedWallet: string): UserNode | null {
  try {
    // getUserNode returns one tuple: (id, registrationTime, isBlocked, isRegistered,
    // wallet, upline, directTeam, totalTeam). Ethers v6 Result supports named + indexed access.
    // Multicall decodeFunctionResult wraps the tuple at [0]; a direct Contract call
    // already returns the tuple itself (where [0] is the numeric id).
    const first = raw?.[0];
    const tuple = first && typeof first === 'object' ? first : raw;
    const wallet = normAddress(tuple?.wallet ?? tuple?.[4]);
    const upline = normAddress(tuple?.upline ?? tuple?.[5]) ?? ZERO;
    const teamRaw = tuple?.directTeam ?? tuple?.[6];
    if (!wallet || wallet !== requestedWallet.toLowerCase() || !Array.isArray(teamRaw)) return null;
    const directTeam = [...new Set<string>(teamRaw.map(normAddress).filter((a: string | null): a is string => !!a))];
    const isRegistered = Boolean(tuple?.isRegistered ?? tuple?.[3]);
    // A failed/nonexistent/unregistered node must not be treated as a real member.
    if (!isRegistered) return null;
    return {
      id: String(tuple?.id ?? tuple?.[0] ?? '0'),
      registrationTime: Number(tuple?.registrationTime ?? tuple?.[1] ?? 0),
      isBlocked: Boolean(tuple?.isBlocked ?? tuple?.[2]),
      isRegistered,
      wallet,
      upline,
      directTeam,
      totalTeam: String(tuple?.totalTeam ?? tuple?.[7] ?? '0'),
    };
  } catch {
    return null;
  }
}

/** Read nodes in bounded Multicall3 batches; failed subcalls are retried individually. */
async function readNodes(
  provider: ethers.Provider,
  hubAddress: string,
  iface: ethers.Interface,
  scope: string,
  wallets: string[],
): Promise<{ nodes: Map<string, UserNode>; failed: string[] }> {
  const unique = [...new Set(wallets.map((w) => w.toLowerCase()))];
  const nodes = new Map<string, UserNode>();
  const missing: string[] = [];
  for (const wallet of unique) {
    const cached = nodeCache.get(nodeKey(scope, wallet));
    if (cached) nodes.set(wallet, cached.node);
    else missing.push(wallet);
  }
  if (!missing.length) return { nodes, failed: [] };

  let multicallOk = false;
  const net = await provider.getNetwork();
  const mcKey = `${net.chainId}:${MULTICALL3_ADDRESS.toLowerCase()}`;
  if (!verifiedMulticall.has(mcKey)) {
    try {
      const code = await provider.getCode(MULTICALL3_ADDRESS);
      verifiedMulticall.set(mcKey, code !== '0x' && code.length > 2);
    } catch {
      verifiedMulticall.set(mcKey, false);
    }
  }
  multicallOk = verifiedMulticall.get(mcKey) === true;

  const unresolved = new Set(missing);
  if (multicallOk) {
    const mc = new ethers.Contract(MULTICALL3_ADDRESS, MULTICALL3_ABI, provider);
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      let settled = false;
      for (let attempt = 0; attempt <= MAX_RETRIES && !settled; attempt++) {
        try {
          const calls = batch.map((wallet) => ({
            target: hubAddress,
            allowFailure: true,
            callData: iface.encodeFunctionData('getUserNode', [wallet]),
          }));
          const results: Array<{ success: boolean; returnData: string }> = await mc.aggregate3(calls);
          // Guard against malformed/truncated aggregate responses: do not mark batch complete.
          if (!Array.isArray(results) || results.length !== batch.length) throw new Error('Multicall response length mismatch');
          results.forEach((result, index) => {
            const wallet = batch[index];
            if (!result?.success || !result.returnData || result.returnData === '0x') return;
            try {
              const decoded = iface.decodeFunctionResult('getUserNode', result.returnData);
              const node = decodeNode(decoded, wallet);
              if (!node) return;
              nodes.set(wallet, node);
              nodeCache.set(nodeKey(scope, wallet), { node, blockNumber: -1 });
              unresolved.delete(wallet);
            } catch { /* leave unresolved for bounded single-call retry */ }
          });
          settled = true;
        } catch {
          if (attempt < MAX_RETRIES) await delay(RETRY_BASE_MS * (2 ** attempt));
        }
      }
    }
  }

  // Fallback/retry each unresolved address with a bounded number of direct calls.
  const stillMissing = [...unresolved];
  for (let i = 0; i < stillMissing.length; i += 8) {
    await Promise.all(stillMissing.slice(i, i + 8).map(async (wallet) => {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const contract = new ethers.Contract(hubAddress, HUB_ABI as any, provider);
          const raw = await contract.getUserNode(wallet);
          const node = decodeNode(raw, wallet);
          if (node) {
            nodes.set(wallet, node);
            nodeCache.set(nodeKey(scope, wallet), { node, blockNumber: -1 });
            unresolved.delete(wallet);
          }
          // A valid call returning an unregistered node is not an RPC failure.
          break;
        } catch {
          if (attempt < MAX_RETRIES) await delay(RETRY_BASE_MS * (2 ** attempt));
        }
      }
    }));
  }
  return { nodes, failed: [...unresolved] };
}

/**
 * Fetch exactly the requested level. To reach level N, levels 1..N-1 must be traversed,
 * but this never fetches descendants below N. Level 1 itself is read from on-chain root
 * directTeam and is intended only as traversal input; existing Level 1 UI stays untouched.
 */
export async function getTeamLevelOnChain(
  provider: ethers.Provider,
  rootWalletInput: string,
  selectedLevel: number,
): Promise<TeamLevelResult> {
  if (!Number.isInteger(selectedLevel) || selectedLevel < 2 || selectedLevel > 10) {
    throw new RangeError('selectedLevel must be an integer from 2 to 10');
  }
  const rootWallet = normAddress(rootWalletInput);
  if (!rootWallet) throw new Error('A valid non-zero root wallet address is required');
  const hubAddress = normAddress(CONTRACT_ADDRESSES?.mdefiHub);
  if (!hubAddress) throw new Error('CONTRACT_ADDRESSES.mdefiHub is missing or invalid');
  const network = await provider.getNetwork();
  const scope = scopedKey(network.chainId, hubAddress, rootWallet);
  const wantedKey = levelKey(scope, selectedLevel);
  const cachedLevel = levelCache.get(wantedKey);
  if (cachedLevel?.complete) return { ...cachedLevel, members: [...cachedLevel.members], failedWallets: [] };
  const existing = inflight.get(wantedKey);
  if (existing) return existing;

  const job = (async (): Promise<TeamLevelResult> => {
    const iface = new ethers.Interface(HUB_ABI as any);
    const rootRead = await readNodes(provider, hubAddress, iface, scope, [rootWallet]);
    const rootNode = rootRead.nodes.get(rootWallet);
    if (!rootNode) {
      return { level: selectedLevel, members: [], complete: false, failedWallets: rootRead.failed.length ? rootRead.failed : [rootWallet], nodesRead: 0 };
    }

    let frontier = rootNode.directTeam;
    const seen = new Set<string>([rootWallet]);
    let nodesRead = 1;
    // Remove repeats from root's direct team, and protect against malformed cycles.
    frontier = frontier.filter((wallet) => {
      if (seen.has(wallet)) return false;
      seen.add(wallet);
      return true;
    });

    for (let level = 1; level <= selectedLevel; level++) {
      const validFrontier = frontier.filter((w) => w !== rootWallet && normAddress(w));
      if (level === selectedLevel) {
        const result = await readNodes(provider, hubAddress, iface, scope, validFrontier);
        nodesRead += result.nodes.size;
        const members = validFrontier.map((w) => result.nodes.get(w)).filter((n): n is UserNode => !!n);
        const complete = result.failed.length === 0;
        const output: TeamLevelResult = {
          level: selectedLevel,
          members,
          complete,
          failedWallets: result.failed,
          nodesRead,
        };
        // Cache only complete lists; never present partial level results as final/cached.
        if (complete) levelCache.set(wantedKey, output);
        return output;
      }

      const result = await readNodes(provider, hubAddress, iface, scope, validFrontier);
      nodesRead += result.nodes.size;
      if (result.failed.length) {
        // Cannot safely claim deeper level is complete if any parent node failed.
        return {
          level: selectedLevel,
          members: [],
          complete: false,
          failedWallets: result.failed,
          nodesRead,
        };
      }
      const next: string[] = [];
      for (const wallet of validFrontier) {
        const node = result.nodes.get(wallet);
        if (!node) continue; // known unregistered node; no descendants can be traversed from it
        for (const child of node.directTeam) {
          if (seen.has(child)) continue;
          seen.add(child);
          next.push(child);
        }
      }
      frontier = next;
      // An empty frontier proves this level and all deeper levels are empty only if all
      // preceding reads completed successfully (which they have here).
      if (frontier.length === 0) {
        const output: TeamLevelResult = { level: selectedLevel, members: [], complete: true, failedWallets: [], nodesRead };
        levelCache.set(wantedKey, output);
        return output;
      }
    }
    return { level: selectedLevel, members: [], complete: false, failedWallets: [], nodesRead };
  })();

  inflight.set(wantedKey, job);
  try { return await job; }
  finally { if (inflight.get(wantedKey) === job) inflight.delete(wantedKey); }
}

/** Clear local read caches after a known tree restructure or when app explicitly refreshes. */
export function clearTeamLevelCache(): void {
  nodeCache.clear();
  levelCache.clear();
  inflight.clear();
}
