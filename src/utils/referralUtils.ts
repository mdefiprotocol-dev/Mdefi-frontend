/**
 * Referral Context Utilities
 * Safely extracts and manages referral code context for the registration session.
 */

/**
 * Extracts referral code from the current browser URL.
 * Supports:
 * - /join?ref=MDF-08421
 * - /?ref=MDF-08421
 * - /#/?ref=MDF-08421 or /#/join?ref=MDF-08421
 * 
 * Returns normalized uppercase referral code or null if not present/invalid.
 */
export function extractReferralCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    let rawRef: string | null = null;

    // 1. Primary: Check query search params (?ref=...)
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search);
      rawRef = params.get('ref');
    }

    // 2. Fallback: Check hash query (?ref=...) if present
    if (!rawRef && window.location.hash && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.substring(window.location.hash.indexOf('?'));
      const hashParams = new URLSearchParams(hashQuery);
      rawRef = hashParams.get('ref');
    }

    // 3. Fallback: Check if path segment is /join/MDF-XXXXX (if any)
    if (!rawRef && window.location.pathname.startsWith('/join/')) {
      const segment = window.location.pathname.replace('/join/', '').split('/')[0];
      if (segment) {
        rawRef = segment;
      }
    }

    if (rawRef) {
      const cleaned = decodeURIComponent(rawRef).trim().toUpperCase();
      // Validate referral code: 3 to 30 characters, alphanumeric with optional hyphens/underscores
      if (/^[A-Z0-9_-]{3,30}$/.test(cleaned)) {
        return cleaned;
      }
    }
  } catch (error) {
    console.warn('[ReferralUtils] Failed to parse referral parameter:', error);
  }

  return null;
}

/**
 * Clears the referral query parameter from the URL after registration completes
 * to prevent stale referral leakage across subsequent visits.
 */
export function clearReferralParamFromUrl(): void {
  if (typeof window === 'undefined' || !window.history || !window.history.replaceState) return;

  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('ref')) {
      url.searchParams.delete('ref');
      const cleanPath = url.pathname === '/join' ? '/' : url.pathname;
      const cleanSearch = url.searchParams.toString() ? `?${url.searchParams.toString()}` : '';
      const newUrl = `${cleanPath}${cleanSearch}${url.hash}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  } catch (error) {
    console.warn('[ReferralUtils] Failed to clear referral parameter:', error);
  }
}
