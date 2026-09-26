import { 
  TradingCandle, 
  TradingTimeframe, 
  ChartEcosystemEvent, 
  EcosystemEventType 
} from './types';
import { ActivityItem } from '../../types';

// Default Target Launching Price (Configurable dynamically)
export const DEFAULT_TARGET_LAUNCH_PRICE = 3.50;

/**
 * Maps on-chain Hub Contract activities directly to chart events
 */
export function mapActivityToEventType(typeStr: string): EcosystemEventType {
  const lower = (typeStr || '').toLowerCase();
  if (lower.includes('claim')) return 'Claim';
  if (lower.includes('referral') || lower.includes('partner')) return 'Referral';
  if (lower.includes('package') || lower.includes('node') || lower.includes('prime') || lower.includes('buy')) return 'Package Activation';
  if (lower.includes('register') || lower.includes('registration')) return 'Registration';
  return 'Referral';
}

/**
 * Creates clean on-chain chart event (Mint vs Claim)
 */
export function createChartEvent(
  type: EcosystemEventType,
  title: string,
  amount: string,
  details: string,
  timestamp: number = Date.now(),
  txHash: string = ''
): ChartEcosystemEvent {
  const isOutgoing = type === 'Claim';
  const color = isOutgoing ? 'red' : 'emerald';
  const badge = isOutgoing ? 'CLAIM' : 'MINT';

  const d = new Date(timestamp);
  const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
    ' · ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });

  return {
    id: `evt-${timestamp}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    title,
    amount,
    details,
    timestamp,
    formattedTime,
    isOutgoing,
    badge,
    color,
    txHash: txHash || '0x...',
    status: 'Confirmed',
  };
}

/**
 * Generates Candlesticks Dynamically:
 * @param timeframe - Selected timeframe (1m, 5m, 1D, etc.)
 * @param activities - Live on-chain activities from Hub Contract
 * @param baseTargetPrice - Dynamic targeted price (Defaults to 3.50, but can accept live contract price)
 */
export function generateCandlesForTimeframe(
  timeframe: TradingTimeframe,
  activities: ActivityItem[] = [],
  baseTargetPrice: number = DEFAULT_TARGET_LAUNCH_PRICE
): TradingCandle[] {
  const count = timeframe === '1m' || timeframe === '5m' ? 34 : 30;
  const onChainEvents: ChartEcosystemEvent[] = [];

  // Bind live on-chain activities directly
  if (Array.isArray(activities) && activities.length > 0) {
    activities.forEach((act) => {
      const actTs = act.timestamp || (act.createdAt ? Number(act.createdAt) : Date.now());
      const eventType = mapActivityToEventType(act.type);
      onChainEvents.push(
        createChartEvent(
          eventType,
          act.title || (eventType === 'Claim' ? 'Reward Claimed' : 'Token Minted'),
          act.amount || '',
          act.details || (eventType === 'Claim' ? 'Withdrawn to Wallet' : 'Minted to Ecosystem'),
          actTs,
          act.txHash
        )
      );
    });
  }

  const now = Date.now();
  let stepMs = 24 * 3600 * 1000;
  let timeFormat: 'time' | 'day' | 'date' = 'day';

  switch (timeframe) {
    case '1m':
      stepMs = 60 * 1000;
      timeFormat = 'time';
      break;
    case '5m':
      stepMs = 5 * 60 * 1000;
      timeFormat = 'time';
      break;
    case '15m':
      stepMs = 15 * 60 * 1000;
      timeFormat = 'time';
      break;
    case '1H':
      stepMs = 3600 * 1000;
      timeFormat = 'time';
      break;
    case '4H':
      stepMs = 4 * 3600 * 1000;
      timeFormat = 'time';
      break;
    case '1D':
      stepMs = 24 * 3600 * 1000;
      timeFormat = 'day';
      break;
    case '1W':
      stepMs = 7 * 24 * 3600 * 1000;
      timeFormat = 'date';
      break;
    case 'ALL':
      stepMs = 12 * 24 * 3600 * 1000;
      timeFormat = 'date';
      break;
  }

  const candles: TradingCandle[] = [];
  const startTs = now - (count - 1) * stepMs;

  // Percentage-based dynamic step (0.2% - 0.4% ratio) so it scales with ANY price
  const microDelta = baseTargetPrice * 0.0025; // Dynamic relative delta
  let currentOpen = baseTargetPrice - (timeframe === 'ALL' ? microDelta * 5 : microDelta);
  let haPrevOpen = currentOpen;
  let haPrevClose = currentOpen;

  for (let i = 0; i < count; i++) {
    const candleTs = startTs + i * stepMs;
    const dateObj = new Date(candleTs);

    const timeLabel = timeFormat === 'time'
      ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

    // Filter events belonging to this timeframe window
    const candleEvents = onChainEvents.filter(
      (ev) => Math.abs(ev.timestamp - candleTs) <= Math.max(stepMs, 60000)
    );

    const hasClaim = candleEvents.some((e) => e.type === 'Claim');
    const hasMint = candleEvents.some(
      (e) => e.type === 'Referral' || e.type === 'Package Activation' || e.type === 'Registration'
    );

    let isGreen = true;
    let spreadRatio = 0.002;

    if (hasClaim && !hasMint) {
      isGreen = false;
      spreadRatio = 0.0035;
    } else if (hasMint) {
      isGreen = true;
      spreadRatio = 0.004;
    } else {
      const periodicClaimDip = (i % 4 === 1 || i % 6 === 0);
      isGreen = !periodicClaimDip;
      spreadRatio = 0.0018 + Math.abs(Math.sin(i * 0.7)) * 0.0012;
    }

    const dynamicSpread = Number((baseTargetPrice * spreadRatio).toFixed(4));
    const open = Number(currentOpen.toFixed(4));
    const close = isGreen 
      ? Number((open + dynamicSpread).toFixed(4))
      : Number((open - dynamicSpread).toFixed(4));

    // Dynamic wicks proportional to price
    const wickOffset = baseTargetPrice * 0.001;
    const high = Number((Math.max(open, close) + wickOffset).toFixed(4));
    const low = Number((Math.min(open, close) - wickOffset).toFixed(4));

    // Proportional volume
    const baseVol = isGreen ? 16000 : 9000;
    const volume = Math.round(baseVol + Math.abs(Math.sin(i * 2.1)) * 12000 + (candleEvents.length * 6000));
    const volumeUsd = Math.round(volume * close);

    currentOpen = close;

    // Heikin Ashi Calculation
    const haClose = Number(((open + high + low + close) / 4).toFixed(4));
    const haOpen = i === 0 
      ? Number(((open + close) / 2).toFixed(4)) 
      : Number(((haPrevOpen + haPrevClose) / 2).toFixed(4));
    const haHigh = Number(Math.max(high, haOpen, haClose).toFixed(4));
    const haLow = Number(Math.min(low, haOpen, haClose).toFixed(4));
    const haIsGreen = haClose >= haOpen;

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
      volume,
      volumeUsd,
      isGreen,
      events: candleEvents.length > 0 ? candleEvents : undefined,
      intensity: Math.min(1, volume / 30000),
      haOpen,
      haHigh,
      haLow,
      haClose,
      haIsGreen,
    });
  }

  // Calculate Moving Averages dynamically
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

/**
 * Dynamic Real-time Event Append
 */
export function appendEcosystemEventToCandles(
  currentCandles: TradingCandle[],
  event: ChartEcosystemEvent,
  baseTargetPrice: number = DEFAULT_TARGET_LAUNCH_PRICE
): TradingCandle[] {
  if (currentCandles.length === 0) return currentCandles;

  const updated = [...currentCandles];
  const lastIndex = updated.length - 1;
  const last = updated[lastIndex];

  const isClaim = event.type === 'Claim';
  const priceDelta = isClaim 
    ? -(baseTargetPrice * 0.0035) 
    : (baseTargetPrice * 0.0045);

  const newOpen = last.close;
  const newClose = Number((newOpen + priceDelta).toFixed(4));
  const newHigh = Number(Math.max(last.high, newOpen, newClose + (baseTargetPrice * 0.001)).toFixed(4));
  const newLow = Number(Math.min(last.low, newOpen, newClose - (baseTargetPrice * 0.001)).toFixed(4));
  const newIsGreen = !isClaim;

  const existingEvents = last.events ? [...last.events] : [];
  existingEvents.push(event);

  const newVolume = last.volume + (isClaim ? 8000 : 15000);

  const haClose = Number(((newOpen + newHigh + newLow + newClose) / 4).toFixed(4));
  const haOpen = Number(((last.haOpen + last.haClose) / 2).toFixed(4));
  const haHigh = Number(Math.max(newHigh, haOpen, haClose).toFixed(4));
  const haLow = Number(Math.min(newLow, haOpen, haClose).toFixed(4));

  updated[lastIndex] = {
    ...last,
    close: newClose,
    high: newHigh,
    low: newLow,
    isGreen: newIsGreen,
    volume: newVolume,
    volumeUsd: Math.round(newVolume * newClose),
    intensity: Math.min(1, newVolume / 30000),
    events: existingEvents,
    haOpen,
    haHigh,
    haLow,
    haClose,
    haIsGreen: haClose >= haOpen,
  };

  return updated;
}