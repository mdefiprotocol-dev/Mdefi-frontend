/**
 * Types and interfaces for the MDeFi Professional Trading Terminal Chart
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

export type EcosystemEventType = 
  | 'Claim' 
  | 'Referral' 
  | 'Package Activation' 
  | 'Registration' 
  | 'Matrix Income' 
  | 'Weekly Reward' 
  | 'Token Claim' 
  | 'Swap' 
  | 'Recycle' 
  | 'Liquidity Event';

export interface ChartEcosystemEvent {
  id: string;
  type: EcosystemEventType;
  title: string;
  amount: string;
  amountNumeric?: number;
  details: string;
  timestamp: number;
  formattedTime: string;
  isOutgoing: boolean; // true = red (claim), false = green/gold (incoming)
  badge: string;
  color: 'emerald' | 'red' | 'amber' | 'purple' | 'cyan' | 'blue';
  txHash?: string;
  status: 'Simulated' | 'Confirmed';
}

export interface TradingCandle {
  id: string;
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // Volume in MBTTC
  volumeUsd: number;
  isGreen: boolean;
  isGold?: boolean; // Registration Flag (Gold Candle)
  events?: ChartEcosystemEvent[];
  intensity: number; // 0 to 1 activity intensity
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