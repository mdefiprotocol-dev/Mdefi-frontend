import { ActivityItem } from '../types';

/**
 * Deterministic Notification & Activity Deduplication Engine
 * 
 * Implements strict multi-tier deduplication hierarchy:
 * 1. Blockchain transaction hash + event/log identifier (highest priority)
 * 2. Existing notification/event ID (unique system IDs)
 * 3. Transaction hash + event type
 * 4. Contract event identifier + user address + event type + relevant timestamp/index
 * 
 * Rules:
 * - Deterministic, pure calculation (no Math.random() in keys)
 * - Preserves user read status when merging records
 * - Never deduplicates two genuinely different activities just because they have the same amount
 * - Scoped strictly to the active wallet address
 */

export function getNotificationDeduplicationKey(item: ActivityItem): string {
  const cleanTx = (item.txHash || '').trim().toLowerCase();
  const hasValidTx = cleanTx !== '' && cleanTx !== '0x0' && cleanTx.length >= 10;
  const cleanType = (item.type || '').trim().toLowerCase();
  const cleanId = (item.id || '').trim().toLowerCase();
  const cleanWallet = (item.walletAddress || '').trim().toLowerCase();

  // Tier 1: Blockchain TxHash + event/log index
  if (hasValidTx) {
    if (item.eventIndex !== undefined) {
      return `tx:${cleanTx}:log:${item.eventIndex}`;
    }
    if (item.logIndex !== undefined) {
      return `tx:${cleanTx}:log:${item.logIndex}`;
    }
    // Tier 3: Transaction hash + event type
    return `tx:${cleanTx}:type:${cleanType}`;
  }

  // Tier 2: Existing verified unique notification ID
  if (cleanId && !cleanId.startsWith('random') && !cleanId.startsWith('temp')) {
    return `id:${cleanId}`;
  }

  // Tier 4: Contract event identifier + user address + event type + date/amount
  const cleanDate = (item.date || '').trim().toLowerCase();
  const cleanAmount = (item.amount || '').trim().toLowerCase();
  return `composite:${cleanWallet}:${cleanType}:${cleanAmount}:${cleanDate}`;
}

/**
 * Normalizes and deduplicates an array of activity/notification items.
 * If targetWallet is specified, filters out any items belonging to other wallets.
 */
export function normalizeAndDeduplicateActivities(
  activities: ActivityItem[] = [],
  targetWallet?: string
): ActivityItem[] {
  if (!Array.isArray(activities)) return [];

  const normalizedTarget = targetWallet ? targetWallet.trim().toLowerCase() : null;
  const seenKeys = new Map<string, ActivityItem>();

  for (const item of activities) {
    if (!item) continue;

    // Strict wallet scoping: skip if this notification belongs to another wallet
    if (normalizedTarget && item.walletAddress) {
      const itemWallet = item.walletAddress.trim().toLowerCase();
      if (itemWallet !== normalizedTarget) {
        continue;
      }
    }

    const key = getNotificationDeduplicationKey(item);

    const finalCreatedAt = getNotificationCreationTimestamp(item);

    if (seenKeys.has(key)) {
      // Merge records to retain richest data and user read state
      const existing = seenKeys.get(key)!;
      const merged: ActivityItem = {
        ...existing,
        ...item,
        createdAt: existing.createdAt || item.createdAt || finalCreatedAt,
        timestamp: existing.timestamp || item.timestamp || finalCreatedAt,
        // If either copy was marked read by the user, keep it read
        read: Boolean(existing.read || item.read),
        // Retain valid txHash if available
        txHash: (item.txHash && item.txHash !== '0x0') ? item.txHash : existing.txHash,
        // Retain richer details
        details: item.details || existing.details,
        title: item.title || existing.title,
        walletAddress: item.walletAddress || existing.walletAddress || targetWallet,
      };
      seenKeys.set(key, merged);
    } else {
      seenKeys.set(key, {
        ...item,
        createdAt: item.createdAt || finalCreatedAt,
        timestamp: item.timestamp || finalCreatedAt,
        walletAddress: item.walletAddress || targetWallet,
        read: Boolean(item.read),
      });
    }
  }

  return Array.from(seenKeys.values());
}

/**
 * Checks if a new activity candidate already exists in the activity list.
 */
export function isDuplicateActivity(
  candidate: ActivityItem,
  existingList: ActivityItem[]
): boolean {
  if (!candidate || !Array.isArray(existingList)) return false;
  const candidateKey = getNotificationDeduplicationKey(candidate);
  return existingList.some((item) => getNotificationDeduplicationKey(item) === candidateKey);
}

/**
 * 24-Hour Notification Retention Window (86,400,000 ms = 24 * 60 * 60 * 1000)
 */
export const NOTIFICATION_RETENTION_MS = 24 * 60 * 60 * 1000;

/**
 * Resolves or parses an immutable creation timestamp (in epoch milliseconds) for any notification item.
 * Preserves existing createdAt/timestamp and prevents resetting on refresh.
 */
export function getNotificationCreationTimestamp(item: ActivityItem, fallbackNow = Date.now()): number {
  if (!item) return fallbackNow;

  // 1. Explicit numeric createdAt (highest reliability)
  if (typeof item.createdAt === 'number' && item.createdAt > 0) {
    return item.createdAt;
  }

  // 2. Explicit numeric timestamp
  if (typeof item.timestamp === 'number' && item.timestamp > 0) {
    return item.timestamp;
  }

  // 3. String-based date parsing
  if (item.date && typeof item.date === 'string') {
    const clean = item.date.trim();

    // Standard date parsing (e.g., "Sep 04, 2026, 12:00 UTC" or ISO string)
    const parsed = Date.parse(clean);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }

    const lower = clean.toLowerCase();

    // Regex for relative elapsed durations (e.g., "30 hours ago", "2 hours ago", "5 mins ago", "10 secs ago")
    const hoursMatch = lower.match(/^(\d+)\s*(?:hours?|hrs?)\s*ago$/);
    if (hoursMatch) {
      return fallbackNow - parseInt(hoursMatch[1], 10) * 3600 * 1000;
    }

    const minsMatch = lower.match(/^(\d+)\s*(?:minutes?|mins?)\s*ago$/);
    if (minsMatch) {
      return fallbackNow - parseInt(minsMatch[1], 10) * 60 * 1000;
    }

    const secsMatch = lower.match(/^(\d+)\s*(?:seconds?|secs?)\s*ago$/);
    if (secsMatch) {
      return fallbackNow - parseInt(secsMatch[1], 10) * 1000;
    }

    const daysMatch = lower.match(/^(\d+)\s*days?\s*ago$/);
    if (daysMatch) {
      return fallbackNow - parseInt(daysMatch[1], 10) * 86400 * 1000;
    }

    if (lower === 'just now') {
      return fallbackNow;
    }

    // Relative date with time specification (e.g., "Today, 12:00 UTC", "Yesterday, 18:42 UTC")
    if (lower.startsWith('today')) {
      const timePart = clean.replace(/^today,?\s*/i, '');
      const todayDate = new Date(fallbackNow);
      const parsedTime = Date.parse(`${todayDate.toISOString().split('T')[0]} ${timePart}`);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        return parsedTime;
      }
      return fallbackNow - 2 * 3600 * 1000; // ~2 hours ago within today
    }

    if (lower.startsWith('yesterday')) {
      const timePart = clean.replace(/^yesterday,?\s*/i, '');
      const yesterdayDate = new Date(fallbackNow - 86400 * 1000);
      const parsedTime = Date.parse(`${yesterdayDate.toISOString().split('T')[0]} ${timePart}`);
      if (!isNaN(parsedTime) && parsedTime > 0) {
        return parsedTime;
      }
      return fallbackNow - 28 * 3600 * 1000; // ~28 hours ago (> 24h, cleanly expired)
    }
  }

  return fallbackNow;
}

/**
 * Checks whether an activity/notification item is strictly within the 24-hour retention window.
 * Keeps active notification history lean without modifying underlying blockchain ledger records.
 */
export function isNotificationWithin24Hours(item: ActivityItem, now = Date.now()): boolean {
  if (!item) return false;
  const creationTs = getNotificationCreationTimestamp(item, now);
  const elapsed = now - creationTs;
  return elapsed <= NOTIFICATION_RETENTION_MS;
}

/**
 * Filters an array of notifications to retain only those within the active 24-hour cycle.
 */
export function filter24HourNotifications(
  activities: ActivityItem[] = [],
  now = Date.now()
): ActivityItem[] {
  if (!Array.isArray(activities)) return [];
  return activities.filter((act) => isNotificationWithin24Hours(act, now));
}

/**
 * Generates a deterministic cleanup cycle identifier for the current wallet.
 * Triggers when all active notifications are cleaned up after 24 hours.
 */
export function getCleanupCycleId(
  allActivities: ActivityItem[] = [],
  walletAddress?: string
): string {
  const cleanWallet = (walletAddress || 'default').trim().toLowerCase();
  if (allActivities.length > 0) {
    const latest = allActivities[0];
    const ts = latest.createdAt || latest.timestamp || getNotificationCreationTimestamp(latest);
    return `cycle_${cleanWallet}_${latest.id}_${ts}`;
  }
  return `cycle_${cleanWallet}_initial`;
}

/**
 * Per-user 24-Hour Greeting and Voluntary Experience Feedback State
 */
export interface GreetingFeedbackState {
  cycleId?: string;
  lastGreetingAt: number;
  rating?: number;
  feedbackNote?: string;
  dismissed?: boolean;
  seen?: boolean;
}

export function getGreetingFeedbackKey(walletAddress?: string): string {
  const clean = (walletAddress || 'default').trim().toLowerCase();
  return `mdefi_greeting_state_${clean}`;
}

export function loadGreetingFeedbackState(walletAddress?: string): GreetingFeedbackState | null {
  try {
    const key = getGreetingFeedbackKey(walletAddress);
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}
  return null;
}

export function saveGreetingFeedbackState(
  walletAddress: string | undefined,
  partialState: Partial<GreetingFeedbackState>
): GreetingFeedbackState {
  const current = loadGreetingFeedbackState(walletAddress) || {
    lastGreetingAt: Date.now(),
  };
  const merged: GreetingFeedbackState = {
    ...current,
    ...partialState,
  };
  try {
    const key = getGreetingFeedbackKey(walletAddress);
    localStorage.setItem(key, JSON.stringify(merged));
  } catch {}
  return merged;
}

/**
 * Determines whether the user should be shown the post-cleanup greeting card.
 * Condition:
 * 1. Active notification list has reached 0 items (all within 24 hours have been cleaned).
 * 2. The greeting has not already been dismissed, rated, or seen for the current cleanup cycle.
 */
export function shouldShow24HourGreeting(
  activeNotificationsCount: number,
  currentCycleId: string,
  walletAddress?: string
): boolean {
  // Only show when the active notification list has been cleaned (0 active notifications)
  if (activeNotificationsCount > 0) {
    return false;
  }

  const state = loadGreetingFeedbackState(walletAddress);
  if (!state) {
    return true;
  }

  // If already associated with the current cycle
  if (state.cycleId === currentCycleId) {
    // If dismissed, rated, or already seen in this cycle, do not show repeated popup
    if (state.dismissed || (state.rating && state.rating > 0) || state.seen) {
      return false;
    }
  }

  return true;
}

