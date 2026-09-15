/**
 * Utility functions for blockchain address and transaction hash formatting and copying.
 * 
 * Requirements:
 * - Display format: 0x1234...ABCD (0x + first 4 characters after 0x + '...' + last 4 characters)
 * - Copying: ALWAYS copies the full, unshortened original string to clipboard.
 */

/**
 * Shortens a blockchain address or transaction hash to compact format: 0x1234...ABCD
 * Example: 0x71C839Fa24e93C298B321f8a84620a3b221B389 -> 0x71C8...B389
 */
export function formatCompactAddress(addressOrHash?: string, emptyFallback: string = ''): string {
  if (!addressOrHash || addressOrHash.trim() === '') return emptyFallback;
  const trimmed = addressOrHash.trim();
  if (trimmed.length <= 13) return trimmed;

  if (trimmed.startsWith('0x') || trimmed.startsWith('0X')) {
    // 0x (2 characters) + first 4 characters after 0x (slice(0, 6)) + '...' + last 4 characters (slice(-4))
    return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
  }

  // Fallback for non-0x prefixed identifiers
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}

/**
 * Safely copies the full, complete address/hash to clipboard.
 * Always passes the unshortened original value.
 */
export async function copyFullAddress(fullAddressOrHash: string): Promise<boolean> {
  if (!fullAddressOrHash) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullAddressOrHash);
      return true;
    }
    // Fallback for environments where navigator.clipboard might be constrained
    const textArea = document.createElement('textarea');
    textArea.value = fullAddressOrHash;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
