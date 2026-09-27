/**
 * Dedicated MDeFi Hub On-Chain Event Service for Trading Terminal Chart
 * 100% On-Chain Event-Driven Architecture (BSC Testnet Chain ID: 97)
 * Strictly zero DEX / zero fake random data
 */

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, HUB_ABI, NETWORK_CONFIG } from '../config/contractConfig';
import { ChartEcosystemEvent, HubCandleActionCategory } from '../components/TradingChart/types';

const BSC_TESTNET_RPC = NETWORK_CONFIG?.rpcUrl || 'https://data-seed-prebsc-1-s1.binance.org:8545/';

// Prevent duplicate event logs
const processedTxMap = new Map<string, ChartEcosystemEvent>();

/**
 * Normalizes official on-chain events from MDEFIEnterpriseHubUnified
 */
function parseHubEventLog(
  log: any,
  blockTimestamp: number
): ChartEcosystemEvent | null {
  const eventName = log.fragment?.name || log.name || '';
  const args = log.args || [];
  const txHash = log.transactionHash || '0x...';
  const blockNumber = log.blockNumber || 0;

  let type: 'Registration' | 'Package Activation' | 'Claim' | 'Referral' = 'Referral';
  let category: HubCandleActionCategory = 'PACKAGE_BUY';
  let badge: 'REG' | 'BUY' | 'CLAIM' | 'MINT' = 'MINT';
  let color: 'amber' | 'emerald' | 'red' = 'emerald';
  let title = 'Protocol Event';
  let details = '';
  let amount = '';
  let isOutgoing = false;

  // 1. 🟡 REGISTRATION / GENESIS MINT -> GOLD (#f59e0b)
  if (eventName === 'Registered') {
    type = 'Registration';
    category = 'REGISTRATION';
    badge = 'REG';
    color = 'amber';
    title = 'New Node Registered';
    const regMintedWei = args.regMinted ?? args[3] ?? 0n;
    amount = regMintedWei > 0n ? `${ethers.formatEther(regMintedWei)} MBTTC` : '30.0 MBTTC';
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
    const priceVal = args.price ?? args.packagePrice ?? args[3] ?? 0;
    amount = `$${priceVal.toString()} Node`;
    const buyerAddr = args.user ?? args[0] ?? '';
    details = buyerAddr ? `Buyer: ${buyerAddr.slice(0, 6)}...${buyerAddr.slice(-4)}` : 'Ecosystem Growth';
    isOutgoing = false;
  }
  // 3. 🔴 REFERRAL REWARD CLAIM -> RED (#ef4444)
  else if (eventName === 'ReferralClaimed') {
    type = 'Claim';
    category = 'REWARD_CLAIM';
    badge = 'CLAIM';
    color = 'red';
    title = 'Referral Yield Claimed';
    const claimAmtWei = args.amount ?? args[1] ?? 0n;
    amount = claimAmtWei > 0n ? `${ethers.formatEther(claimAmtWei)} MBTTC` : 'Claimed MBTTC';
    const leaderAddr = args.leader ?? args[0] ?? '';
    details = leaderAddr ? `Leader: ${leaderAddr.slice(0, 6)}...${leaderAddr.slice(-4)}` : 'Vault Withdrawal';
    isOutgoing = true;
  }
  // 4. 🔴 PACKAGE REWARD CLAIM -> RED (#ef4444)
  else if (eventName === 'PackageClaimed') {
    type = 'Claim';
    category = 'REWARD_CLAIM';
    badge = 'CLAIM';
    color = 'red';
    title = 'Package Yield Claimed';
    const claimAmtWei = args.amount ?? args[1] ?? 0n;
    amount = claimAmtWei > 0n ? `${ethers.formatEther(claimAmtWei)} MBTTC` : 'Claimed MBTTC';
    const userAddr = args.user ?? args[0] ?? '';
    details = userAddr ? `User: ${userAddr.slice(0, 6)}...${userAddr.slice(-4)}` : 'Vault Withdrawal';
    isOutgoing = true;
  } else {
    return null;
  }

  const d = new Date(blockTimestamp * 1000);
  const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
    ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return {
    id: `hub-evt-${txHash}-${log.index ?? 0}`,
    type,
    title,
    amount,
    details,
    timestamp: blockTimestamp * 1000,
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
    this.provider = new ethers.JsonRpcProvider(BSC_TESTNET_RPC);
    const hubAddress = CONTRACT_ADDRESSES?.mdefiHub;

    if (hubAddress && ethers.isAddress(hubAddress)) {
      this.hubContract = new ethers.Contract(hubAddress, HUB_ABI as any, this.provider);
    }
  }

  /**
   * Reads real historical Hub contract events across past blocks
   */
  public async fetchHistoricalHubEvents(blockRange: number = 3000): Promise<ChartEcosystemEvent[]> {
    if (!this.hubContract) return [];

    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - blockRange);

      const filter = {
        address: await this.hubContract.getAddress(),
        fromBlock,
        toBlock: currentBlock,
      };

      const rawLogs = await this.provider.getLogs(filter);
      const parsedEvents: ChartEcosystemEvent[] = [];

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
          const timestamp = block?.timestamp || Math.floor(Date.now() / 1000);

          const eventItem = parseHubEventLog(
            { ...parsed, transactionHash: log.transactionHash, blockNumber: log.blockNumber, index: log.index },
            timestamp
          );

          if (eventItem) {
            processedTxMap.set(txKey, eventItem);
            parsedEvents.push(eventItem);
          }
        } catch {
          continue;
        }
      }

      return parsedEvents.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.warn('[ChartHubEventService] Failed to fetch on-chain history:', error);
      return [];
    }
  }

  /**
   * Subscribes to real-time Hub contract events
   */
  public subscribeToRealtimeHubEvents(
    onNewEvent: (event: ChartEcosystemEvent) => void
  ): () => void {
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
        const timestamp = block?.timestamp || Math.floor(Date.now() / 1000);

        const parsed = this.hubContract!.interface.parseLog({
          topics: log.topics as string[],
          data: log.data,
        });

        if (!parsed) return;

        const eventItem = parseHubEventLog(
          { ...parsed, transactionHash: log.transactionHash, blockNumber: log.blockNumber, index: log.index },
          timestamp
        );

        if (eventItem) {
          processedTxMap.set(txKey, eventItem);
          onNewEvent(eventItem);
        }
      } catch (err) {
        console.error('[ChartHubEventService] Error processing live event:', err);
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