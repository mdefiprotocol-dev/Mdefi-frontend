import { 
  TradingCandle, 
  TradingTimeframe, 
  ChartEcosystemEvent, 
  EcosystemEventType 
} from './types';
import { ActivityItem } from '../../types';

// Benchmark baseline price around $1.50 with realistic corridor
const BASELINE_PRICE = 1.50;

/**
 * Maps raw activity item type to chart ecosystem event type
 */
export function mapActivityToEventType(typeStr: string): EcosystemEventType {
  const lower = typeStr.toLowerCase();
  if (lower.includes('claim')) return 'Claim';
  if (lower.includes('referral') || lower.includes('partner')) return 'Referral';
  if (lower.includes('package') || lower.includes('node') || lower.includes('prime')) return 'Package Activation';
  if (lower.includes('matrix') || lower.includes('s4')) return 'Matrix Income';
  if (lower.includes('weekly') || lower.includes('salary')) return 'Weekly Reward';
  if (lower.includes('swap')) return 'Swap';
  if (lower.includes('recycle') || lower.includes('cycle')) return 'Recycle';
  if (lower.includes('liquidity') || lower.includes('pool')) return 'Liquidity Event';
  if (lower.includes('register') || lower.includes('registration')) return 'Registration';
  return 'Token Claim';
}

/**
 * Creates a chart event object
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
  
  let color: ChartEcosystemEvent['color'] = 'emerald';
  let badge = '●';

  switch (type) {
    case 'Claim':
      color = 'red';
      badge = 'CLAIM';
      break;
    case 'Referral':
      color = 'emerald';
      badge = 'REF';
      break;
    case 'Package Activation':
      color = 'emerald';
      badge = 'NODE';
      break;
    case 'Matrix Income':
      color = 'cyan';
      badge = 'MATRIX';
      break;
    case 'Weekly Reward':
      color = 'emerald';
      badge = 'WEEKLY';
      break;
    case 'Recycle':
      color = 'purple';
      badge = 'RECYCLE';
      break;
    case 'Swap':
      color = 'amber';
      badge = 'SWAP';
      break;
    case 'Liquidity Event':
      color = 'blue';
      badge = 'LP';
      break;
    case 'Registration':
      color = 'cyan';
      badge = 'REG';
      break;
    default:
      color = 'emerald';
      badge = 'EVENT';
  }

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
    txHash: txHash || `0x${Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}...`,
    status: 'Simulated',
  };
}

/**
 * Generate initial predefined realistic ecosystem events
 */
function getInitialEcosystemEvents(): ChartEcosystemEvent[] {
  const now = Date.now();
  const H = 3600 * 1000;
  const D = 24 * H;

  return [
    createChartEvent(
      'Package Activation',
      'Package Activation',
      '+$120.00 USDT',
      'Package: Nexus Prime (Node #4)',
      now - 3 * D - 4 * H
    ),
    createChartEvent(
      'Referral',
      'Direct Referral Bonus',
      '+45.00 MBTTC',
      'Partner MDF-71822 registered in frontline',
      now - 2 * D - 8 * H
    ),
    createChartEvent(
      'Matrix Income',
      'S4 Matrix Spillover',
      '+30.00 MBTTC',
      'Senior Node 2x2 Matrix Position 3 Filled',
      now - 2 * D - 2 * H
    ),
    createChartEvent(
      'Claim',
      'Reward Claim',
      '−120.00 MBTTC',
      'Withdrawn to connected Web3 wallet',
      now - 1 * D - 14 * H
    ),
    createChartEvent(
      'Recycle',
      'S4 Matrix Cycle Recycle',
      'Cycle 3 Complete',
      'Position recycled into fresh cycle 4',
      now - 1 * D - 7 * H
    ),
    createChartEvent(
      'Package Activation',
      'Package Activation',
      '+$70.00 USDT',
      'Package: Quantum Node (Node #3)',
      now - 20 * H
    ),
    createChartEvent(
      'Weekly Reward',
      'Starter Weekly Distribution',
      '+18.50 MBTTC',
      'Cycle yield credited to pool share',
      now - 12 * H
    ),
    createChartEvent(
      'Claim',
      'Reward Claim',
      '−65.00 MBTTC',
      'Claimed referral & node yields',
      now - 5 * H
    ),
    createChartEvent(
      'Referral',
      'Direct Referral Bonus',
      '+25.00 MBTTC',
      'Partner MDF-93401 registered in frontline',
      now - 2 * H
    ),
  ];
}

/**
 * Generate candles for a specific timeframe with deterministic seed and realistic curve
 */
export function generateCandlesForTimeframe(
  timeframe: TradingTimeframe,
  activities: ActivityItem[] = []
): TradingCandle[] {
  const count = timeframe === '1m' || timeframe === '5m' ? 36 : 32;
  const initialEvents = getInitialEcosystemEvents();

  // Convert real activities into events as well
  activities.slice(0, 10).forEach((act) => {
    const actTimestamp = act.timestamp || (act.createdAt ? act.createdAt : Date.now() - Math.random() * 86400000 * 2);
    const eventType = mapActivityToEventType(act.type);
    initialEvents.push(
      createChartEvent(
        eventType,
        act.title || act.type,
        act.amount,
        act.details || `Activity transaction ${act.txHash?.substring(0, 8) || ''}`,
        actTimestamp,
        act.txHash
      )
    );
  });

  const now = Date.now();
  let stepMs = 3600 * 1000;
  let timeFormat: 'time' | 'day' | 'date' = 'time';

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
      stepMs = 60 * 60 * 1000;
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
      stepMs = 14 * 24 * 3600 * 1000;
      timeFormat = 'date';
      break;
  }

  const candles: TradingCandle[] = [];
  const startTs = now - (count - 1) * stepMs;

  let prevClose = BASELINE_PRICE - 0.045;
  let haPrevOpen = prevClose;
  let haPrevClose = prevClose;

  for (let i = 0; i < count; i++) {
    const candleTs = startTs + i * stepMs;
    const dateObj = new Date(candleTs);

    let timeLabel = '';
    if (timeFormat === 'time') {
      timeLabel = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeFormat === 'day') {
      timeLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      timeLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    // Correlate with events happening in this window
    const candleEvents = initialEvents.filter(
      (ev) => Math.abs(ev.timestamp - candleTs) <= stepMs * 0.95
    );

    // If there is an outgoing claim event, push downward movement;
    // If there is a referral or package activation, push upward movement
    let bias = 0;
    const hasClaim = candleEvents.some((e) => e.type === 'Claim');
    const hasGrowth = candleEvents.some(
      (e) => e.type === 'Referral' || e.type === 'Package Activation' || e.type === 'Matrix Income'
    );

    if (hasClaim && !hasGrowth) {
      bias = -0.012;
    } else if (hasGrowth) {
      bias = 0.018;
    } else {
      // Natural slight upward drift with sinusoidal wave
      bias = Math.sin(i * 0.45) * 0.007 + 0.002;
    }

    const open = Number(prevClose.toFixed(4));
    const close = Number(Math.max(1.35, open + bias + (Math.sin(i * 1.3) * 0.005)).toFixed(4));
    const isGreen = close >= open;

    const high = Number((Math.max(open, close) + Math.abs(Math.sin(i * 2.1) * 0.008) + 0.004).toFixed(4));
    const low = Number((Math.min(open, close) - Math.abs(Math.cos(i * 1.7) * 0.007) - 0.003).toFixed(4));

    // Volume calculation: Higher volume on event candles
    const baseVolume = 3200 + Math.abs(Math.sin(i * 0.8)) * 8500;
    const eventVolumeBoost = candleEvents.length * 9500;
    const volume = Math.round(baseVolume + eventVolumeBoost);
    const volumeUsd = Math.round(volume * close);

    const intensity = Math.min(1, (volume / 25000));

    // Heikin Ashi calculation
    const haClose = Number(((open + high + low + close) / 4).toFixed(4));
    const haOpen = i === 0 
      ? Number(((open + close) / 2).toFixed(4)) 
      : Number(((haPrevOpen + haPrevClose) / 2).toFixed(4));
    const haHigh = Number(Math.max(high, haOpen, haClose).toFixed(4));
    const haLow = Number(Math.min(low, haOpen, haClose).toFixed(4));
    const haIsGreen = haClose >= haOpen;

    haPrevOpen = haOpen;
    haPrevClose = haClose;
    prevClose = close;

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
      intensity,
      haOpen,
      haHigh,
      haLow,
      haClose,
      haIsGreen,
    });
  }

  // Calculate Moving Averages (MA7 and MA25)
  for (let i = 0; i < candles.length; i++) {
    // MA 7
    if (i >= 6) {
      const slice7 = candles.slice(i - 6, i + 1);
      const sum7 = slice7.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma7 = Number((sum7 / 7).toFixed(4));
    }
    // MA 25
    if (i >= 24) {
      const slice25 = candles.slice(i - 24, i + 1);
      const sum25 = slice25.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma25 = Number((sum25 / 25).toFixed(4));
    }
  }

  return candles;
}

/**
 * Appends a new event and returns updated candles with visual reaction
 */
export function appendEcosystemEventToCandles(
  currentCandles: TradingCandle[],
  event: ChartEcosystemEvent
): TradingCandle[] {
  if (currentCandles.length === 0) return currentCandles;

  const updated = [...currentCandles];
  const lastIndex = updated.length - 1;
  const last = updated[lastIndex];

  // Adjust price of the current/last candle to react immediately
  const isClaim = event.type === 'Claim';
  const priceDelta = isClaim ? -0.016 : 0.022;

  const newOpen = last.close;
  const newClose = Number((newOpen + priceDelta).toFixed(4));
  const newHigh = Number(Math.max(last.high, newOpen, newClose + 0.006).toFixed(4));
  const newLow = Number(Math.min(last.low, newOpen, newClose - 0.006).toFixed(4));
  const newIsGreen = newClose >= newOpen;

  const existingEvents = last.events ? [...last.events] : [];
  existingEvents.push(event);

  const newVolume = last.volume + (isClaim ? 12000 : 18500);

  // Recompute Heikin Ashi
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
    intensity: Math.min(1, newVolume / 25000),
    events: existingEvents,
    haOpen,
    haHigh,
    haLow,
    haClose,
    haIsGreen: haClose >= haOpen,
  };

  return updated;
}
