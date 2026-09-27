/**
 * MDeFi Hub Dedicated On-Chain Telemetry Service (BSC Testnet Chain ID: 97)
 * Strictly pulls real events from MDEFIEnterpriseHubUnified:
 * - Registered -> 30 MBTTC Genesis Mint (Gold)
 * - PackageActivated / NodeInitialized -> $10 / $25 Package Buy (Green)
 * - ReferralClaimed / PackageClaimed -> MBTTC Claim (Red)
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, HUB_ABI } from '../config/contractConfig';
import { ChartEcosystemEvent, HubCandleActionCategory } from '../components/TradingChart/types';

// Fast, non-rate-limited RPC verified directly on terminal for getLogs
const VERIFIED_FAST_RPC = 'https://bsc-testnet.publicnode.com';
const processedTxMap = new Map<string, ChartEcosystemEvent>();

function parseHubLog(log: any, blockTimestampSec: number): ChartEcosystemEvent | null {
  const eventName = log.fragment?.name || log.name || '';
  const args = log.args || [];
  const txHash = log.transactionHash || '0x...';
  const blockNumber = log.blockNumber || 0;
  const timestampMs = blockTimestampSec * 1000;

  let type: 'Registration' | 'Package Activation' | 'Claim' | 'Referral' = 'Referral';
  let category: HubCandleActionCategory = 'PACKAGE_BUY';
  let badge: 'REG' | 'BUY' | 'CLAIM' | 'MINT' = 'MINT';
  let color: 'amber' | 'emerald' | 'red' = 'emerald';
  let title = 'Protocol Event';
  let details = '';
  let amount = '';
  let amountNumeric = 0;
  let isOutgoing = false;

  // 1. 🟡 REGISTRATION -> GOLD (#f59e0b)
  if (eventName === 'Registered') {
    type = 'Registration';
    category = 'REGISTRATION';
    badge = 'REG';
    color = 'amber';
    title = 'New Node Registered';
    const regMinted = args.regMinted ?? args[3] ?? 0n;
    amountNumeric = regMinted > 0n ? parseFloat(ethers.formatEther(regMinted)) : 30.0;
    amount = `${amountNumeric.toFixed(2)} MBTTC`;
    const userAddr = args.user ?? args[0] ?? '';
    details = userAddr ? `User: ${userAddr.slice(0, 6)}...${userAddr.slice(-4)}` : 'On-Chain Mint';
    isOutgoing = false;
  }
  // 2. 🟢 PACKAGE BUY ($10 / $25) -> GREEN (#10b981)
  else if (eventName === 'PackageActivated' || eventName === 'NodeInitialized') {
    type = 'Package Activation';
    category = 'PACKAGE_BUY';
    badge = 'BUY';
    color = 'emerald';
    const pkgId = Number(args.packageId ?? args[1] ?? 1);
    title = pkgId === 1 ? 'Junior Node Activated' : pkgId === 2 ? 'Senior Node Activated' : `Package #${pkgId} Activated`;
    const priceVal = Number(args.price ?? args.packagePrice ?? args[3] ?? 0);
    amountNumeric = priceVal > 0 ? priceVal : (pkgId === 1 ? 10 : 25);
    amount = `$${amountNumeric} Node`;
    const buyerAddr = args.user ?? args[0] ?? '';
    details = buyerAddr ? `Buyer: ${buyerAddr.slice(0, 6)}...${buyerAddr.slice(-4)}` : 'Ecosystem Growth';
    isOutgoing = false;
  }
  // 3. 🔴 REFERRAL CLAIM -> RED (#ef4444)
  else if (eventName === 'ReferralClaimed') {
    type = 'Claim';
    category = 'REWARD_CLAIM';
    badge = 'CLAIM';
    color = 'red';
    title = 'Referral Reward Claimed';
    const claimAmt = args.amount ?? args[1] ?? 0n;
    amountNumeric = claimAmt > 0n ? parseFloat(ethers.formatEther(claimAmt)) : 0;
    amount = `${amountNumeric.toFixed(2)} MBTTC`;
    const leaderAddr = args.leader ?? args[0] ?? '';
    details = leaderAddr ? `Leader: ${leaderAddr.slice(0, 6)}...${leaderAddr.slice(-4)}` : 'Vault Withdrawal';
    isOutgoing = true;
  }
  // 4. 🔴 PACKAGE CLAIM -> RED (#ef4444)
  else if (eventName === 'PackageClaimed') {
    type = 'Claim';
    category = 'REWARD_CLAIM';
    badge = 'CLAIM';
    color = 'red';
    title = 'Package Reward Claimed';
    const claimAmt = args.amount ?? args[1] ?? 0n;
    amountNumeric = claimAmt > 0n ? parseFloat(ethers.formatEther(claimAmt)) : 0;
    amount = `${amountNumeric.toFixed(2)} MBTTC`;
    const userAddr = args.user ?? args[0] ?? '';
    details = userAddr ? `User: ${userAddr.slice(0, 6)}...${userAddr.slice(-4)}` : 'Vault Withdrawal';
    isOutgoing = true;
  } else {
    return null;
  }

  const d = new Date(timestampMs);
  const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return {
    id: `hub-${txHash}-${log.index ?? 0}`,
    type,
    title,
    amount,
    amountNumeric,
    details,
    timestamp: timestampMs,
    formattedTime,
    isOutgoing,
    badge,
    color,
    txHash,
    blockNumber,
    walletAddress: args[0] ? String(args[0]) : undefined,
    candleActionCategory: category,
    status: 'Confirmed',
  };
}

export class ChartHubEventService {
  private provider: ethers.JsonRpcProvider;
  private hubContract: ethers.Contract | null = null;
  private isListening = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(VERIFIED_FAST_RPC, undefined, { staticNetwork: true });
    const hubAddress = CONTRACT_ADDRESSES?.mdefiHub;
    if (hubAddress && ethers.isAddress(hubAddress)) {
      this.hubContract = new ethers.Contract(hubAddress, HUB_ABI as any, this.provider);
    }
  }

  public async fetchHistoricalHubEvents(blockRange: number = 100000): Promise<ChartEcosystemEvent[]> {
    if (!this.hubContract) return [];

    try {
      const currentBlock = await this.provider.getBlockNumber();
      const startBlock = Math.max(0, currentBlock - blockRange);
      const CHUNK_SIZE = 9500;
      const hubAddr = await this.hubContract.getAddress();
      const parsedEvents: ChartEcosystemEvent[] = [];

      for (let from = startBlock; from <= currentBlock; from += CHUNK_SIZE) {
        const to = Math.min(from + CHUNK_SIZE - 1, currentBlock);
        try {
          const rawLogs = await this.provider.getLogs({
            address: hubAddr,
            fromBlock: from,
            toBlock: to,
          });

          for (const log of rawLogs) {
            try {
              const parsed = this.hubContract.interface.parseLog({
                topics: log.topics as string[],
                data: log.data,
              });

              if (!parsed) continue;

              const txKey = `${log.transactionHash}-${log.index}`;
              if (processedTxMap.has(txKey)) {
                parsedEvents.push(processedTxMap.get(txKey)!);
                continue;
              }

              const block = await this.provider.getBlock(log.blockNumber);
              const blockTs = block?.timestamp || Math.floor(Date.now() / 1000);

              const eventItem = parseHubLog(
                { ...parsed, transactionHash: log.transactionHash, blockNumber: log.blockNumber, index: log.index },
                blockTs
              );

              if (eventItem) {
                processedTxMap.set(txKey, eventItem);
                parsedEvents.push(eventItem);
              }
            } catch {
              continue;
            }
          }
        } catch {
          continue;
        }
      }

      return parsedEvents.sort((a, b) => a.timestamp - b.timestamp);
    } catch (err) {
      console.warn('[ChartHubEventService] Failed to fetch on-chain logs:', err);
      return [];
    }
  }

  public subscribeToRealtimeHubEvents(onNewEvent: (event: ChartEcosystemEvent) => void): () => void {
    if (!this.hubContract || this.isListening) return () => {};
    this.isListening = true;

    const listener = async (...argsWithEvent: any[]) => {
      try {
        const payload = argsWithEvent[argsWithEvent.length - 1];
        const log = payload?.log || payload;
        if (!log || !log.transactionHash) return;

        const txKey = `${log.transactionHash}-${log.index ?? 0}`;
        if (processedTxMap.has(txKey)) return;

        const block = await this.provider.getBlock(log.blockNumber);
        const blockTs = block?.timestamp || Math.floor(Date.now() / 1000);

        const parsed = this.hubContract!.interface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });

        if (!parsed) return;

        const eventItem = parseHubLog(
          { ...parsed, transactionHash: log.transactionHash, blockNumber: log.blockNumber, index: log.index },
          blockTs
        );

        if (eventItem) {
          processedTxMap.set(txKey, eventItem);
          onNewEvent(eventItem);
        }
      } catch (err) {
        console.error('[ChartHubEventService] Error processing live block event:', err);
      }
    };

    this.hubContract.on('*', listener);

    return () => {
      if (this.hubContract) {
        this.hubContract.off('*', listener);
      }
      this.isListening = false;
    };
  }
}

export const chartHubEventService = new ChartHubEventService();