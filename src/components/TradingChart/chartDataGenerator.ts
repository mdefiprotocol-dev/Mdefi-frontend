import { 
  TradingCandle, 
  TradingTimeframe, 
  ChartEcosystemEvent, 
  EcosystemEventType 
} from './types';
import { ActivityItem } from '../../types';

export const DEFAULT_TARGET_LAUNCH_PRICE = 3.50;

export function mapActivityToEventType(typeStr: string): EcosystemEventType {
  const lower = (typeStr || '').toLowerCase();
  if (lower.includes('claim')) return 'Claim';
  if (lower.includes('register') || lower.includes('registration')) return 'Registration';
  if (lower.includes('package') || lower.includes('node') || lower.includes('buy')) return 'Package Activation';
  return 'Referral';
}

function parseNumericAmount(amountStr: string | number): number {
  if (typeof amountStr === 'number') return amountStr;
  if (!amountStr) return 0;
  const cleaned = String(amountStr).replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function createChartEvent(
  type: EcosystemEventType,
  title: string,
  amount: string,
  details: string,
  timestamp: number = Date.now(),
  txHash: string = ''
): ChartEcosystemEvent {
  const isClaim = type === 'Claim';
  const isRegistration = type === 'Registration';

  const color = isRegistration ? 'amber' : isClaim ? 'red' : 'emerald';
  const badge = isRegistration ? 'REG' : isClaim ? 'CLAIM' : 'BUY';

  const d = new Date(timestamp);
  const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
    ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return {
    id: `evt-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    amount,
    amountNumeric: parseNumericAmount(amount),
    details,
    timestamp,
    formattedTime,
    isOutgoing: isClaim,
    badge,
    color,
    txHash: txHash || '0x...',
    status: 'Confirmed',
  };
}

export function generateCandlesForTimeframe(
  timeframe: TradingTimeframe,
  activities: ActivityItem[] = [],
  baseTargetPrice: number = DEFAULT_TARGET_LAUNCH_PRICE
): TradingCandle[] {
  const count = timeframe === '1m' || timeframe === '5m' ? 36 : 30;
  const onChainEvents: ChartEcosystemEvent[] = [];

  if (Array.isArray(activities) && activities.length > 0) {
    activities.forEach((act) => {
      const actTs = act.timestamp || (act.createdAt ? Number(act.createdAt) : Date.now());
      const eventType = mapActivityToEventType(act.type);
      onChainEvents.push(
        createChartEvent(
          eventType,
          act.title || '',
          act.amount || '',
          act.details || '',
          actTs,
          act.txHash
        )
      );
    });
  }

  // Pure sort by true blockchain timestamp
  onChainEvents.sort((a, b) => a.timestamp - b.timestamp);

  const now = Date.now();
  let stepMs = 24 * 3600 * 1000;
  let timeFormat: 'time' | 'day' | 'date' = 'day';

  switch (timeframe) {
    case '1m': stepMs = 60 * 1000; timeFormat = 'time'; break;
    case '5m': stepMs = 5 * 60 * 1000; timeFormat = 'time'; break;
    case '15m': stepMs = 15 * 60 * 1000; timeFormat = 'time'; break;
    case '1H': stepMs = 3600 * 1000; timeFormat = 'time'; break;
    case '4H': stepMs = 4 * 3600 * 1000; timeFormat = 'time'; break;
    case '1D': stepMs = 24 * 3600 * 1000; timeFormat = 'day'; break;
    case '1W': stepMs = 7 * 24 * 3600 * 1000; timeFormat = 'date'; break;
    case 'ALL': {
      const earliestTs = onChainEvents.length > 0 
        ? onChainEvents[0].timestamp 
        : (now - 3 * 24 * 3600 * 1000);
      const totalSpan = Math.max(now - earliestTs, 3600 * 1000);
      stepMs = Math.max(Math.ceil(totalSpan / (count - 2)), 60 * 1000);
      timeFormat = 'date';
      break;
    }
  }

  const candles: TradingCandle[] = [];
  const startTs = now - (count - 1) * stepMs;

  let currentPrice = baseTargetPrice;
  let haPrevOpen = currentPrice;
  let haPrevClose = currentPrice;

  for (let i = 0; i < count; i++) {
    const candleTs = startTs + i * stepMs;
    const nextCandleTs = candleTs + stepMs;
    const dateObj = new Date(candleTs);

    const timeLabel = timeFormat === 'time'
      ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Filter events occurring strictly within this exact time bucket
    const candleEvents = onChainEvents.filter(
      (ev) => ev.timestamp >= candleTs && ev.timestamp < nextCandleTs
    );

    let isGreen = false;
    let isGold = false;
    let candleVolume = 0;
    let totalMintedAmount = 0;
    let totalClaimedAmount = 0;

    let hasReg = false;
    let hasPkg = false;
    let hasClaim = false;

    if (candleEvents.length > 0) {
      candleEvents.forEach((ev) => {
        const amt = ev.amountNumeric || parseNumericAmount(ev.amount) || 0;
        candleVolume += amt;

        if (ev.type === 'Registration') {
          hasReg = true;
          totalMintedAmount += amt;
        } else if (ev.type === 'Package Activation') {
          hasPkg = true;
          totalMintedAmount += amt;
        } else if (ev.type === 'Claim') {
          hasClaim = true;
          totalClaimedAmount += amt;
        }
      });

      if (hasReg) {
        isGold = true;
        isGreen = false;
      } else if (hasPkg) {
        isGreen = true;
        isGold = false;
      } else if (hasClaim) {
        isGreen = false;
        isGold = false;
      }
    }

    const open = Number(currentPrice.toFixed(4));
    let close = open;

    // Body height: Derived purely from the difference of on-chain minted vs claimed tokens
    if (candleVolume > 0) {
      const netTokenFlow = totalMintedAmount - totalClaimedAmount;
      // Proportional ratio based on standard token issuance scale
      const delta = netTokenFlow !== 0 ? (netTokenFlow / 10000) : (isGold ? 0.001 : 0.0005);
      close = Number((open + delta).toFixed(4));
    }

    // Wick size scales strictly with transaction volume
    const wickDelta = candleVolume > 0 ? Number((Math.min(candleVolume / 2000, 0.002)).toFixed(4)) : 0;
    const high = Number((Math.max(open, close) + wickDelta).toFixed(4));
    const low = Number((Math.min(open, close) - wickDelta).toFixed(4));

    currentPrice = close;

    const haClose = Number(((open + high + low + close) / 4).toFixed(4));
    const haOpen = i === 0 
      ? Number(((open + close) / 2).toFixed(4)) 
      : Number(((haPrevOpen + haPrevClose) / 2).toFixed(4));
    const haHigh = Number(Math.max(high, haOpen, haClose).toFixed(4));
    const haLow = Number(Math.min(low, haOpen, haClose).toFixed(4));

    haPrevOpen = haOpen;
    haPrevClose = haClose;

    candles.push({
      id: `candle-${timeframe}-${i}-${candleTs}`,
      time: timeLabel,
      timestamp: candleTs,
      open,
      high,
      low,
      close,
      volume: Number(candleVolume.toFixed(2)),
      volumeUsd: Number((candleVolume * close).toFixed(2)),
      isGreen: candleVolume > 0 ? (isGreen || isGold) : true,
      isGold,
      events: candleEvents.length > 0 ? candleEvents : undefined,
      intensity: candleVolume > 0 ? Math.min(1, candleVolume / 500) : 0,
      haOpen,
      haHigh,
      haLow,
      haClose,
      haIsGreen: isGreen || isGold,
      haIsGold: isGold,
    });
  }

  // Moving Averages
  for (let i = 0; i < candles.length; i++) {
    if (i >= 6) {
      const slice7 = candles.slice(i - 6, i + 1);
      const sum7 = slice7.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma7 = Number((sum7 / 7).toFixed(4));
    }
    if (i >= 24) {
      const slice25 = candles.slice(i - 24, i + 1);
      const sum25 = slice25.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma25 = Number((sum25 / 25).toFixed(4));
    }
  }

  return candles;
}