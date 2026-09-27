/**
 * Types and interfaces for the MDeFi Professional Trading Terminal Chart
 * Hub Contract On-Chain Telemetry & Event-Driven Candlestick Engine
 * Non-DEX Activity Architecture (100% On-Chain Traceable)
 */

export type TradingChartType = 
  | 'Candlestick' 
  | 'Line' 
  | 'Area' 
  | 'Bar' 
  | 'OHLC' 
  | 'Heikin Ashi' 
  | 'Baseline' 
  | 'Hollow Candles';

export type TradingTimeframe = 
  | '1m' 
  | '5m' 
  | '15m' 
  | '1H' 
  | '4H' 
  | '1D' 
  | '1W' 
  | 'ALL';

// On-Chain Hub Contract Action Categories
export type HubCandleActionCategory = 
  | 'REGISTRATION'  // GOLD: New User / Genesis Mint (#f59e0b)
  | 'PACKAGE_BUY'   // GREEN: buyPackageOnHub $10/$25 (#10b981)
  | 'REWARD_CLAIM';  // RED: claimReferralReward / claimPackageReward (#ef4444)

export type EcosystemEventType = 
  | 'Registration'
  | 'Package Activation'
  | 'Referral'
  | 'Claim'
  | 'Matrix Income'
  | 'Weekly Reward';

export interface ChartEcosystemEvent {
  id: string;
  type: EcosystemEventType;
  title: string;
  amount: string;
  amountNumeric?: number;
  details: string;
  timestamp: number;
  formattedTime: string;
  isOutgoing: boolean; // true = red (claim withdrawal), false = incoming (mint)
  badge: 'REG' | 'BUY' | 'CLAIM' | 'MINT';
  color: 'amber' | 'emerald' | 'red';
  txHash?: string;
  blockNumber?: number;
  walletAddress?: string;
  candleActionCategory?: HubCandleActionCategory;
  status: 'Confirmed';
}

export interface TradingCandle {
  id: string;
  time: string;
  timestamp: number;
  // Derived relative OHLC around $3.50 target launching price
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // Volume in MBTTC tokens
  volumeUsd: number;
  
  // 3-Color Candle Determinants
  isGreen: boolean;
  isGold?: boolean;
  dominantAction?: HubCandleActionCategory;
  
  // Attached real on-chain events inside this timeframe window
  events?: ChartEcosystemEvent[];
  intensity: number; // 0 to 1 activity intensity based on volume
  
  // Heikin Ashi values
  haOpen: number;
  haHigh: number;
  haLow: number;
  haClose: number;
  haIsGreen: boolean;
  haIsGold?: boolean;
  
  // Moving averages
  ma7?: number;
  ma25?: number;
}

export interface ChartIndicatorSettings {
  ma: boolean;
  volume: boolean;
  events: boolean;
  intensity: boolean;
  grid: boolean;
}

export interface TickerMetrics {
  currentPrice: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  totalRewardsMbttc: string;
  totalRewardsUsd: string;
  activeEventsCount: number;
  modeLabel: string;
  isSimulated: boolean;
}