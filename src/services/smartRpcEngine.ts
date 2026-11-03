/**
 * ============================================================================
 * MDeFi SMART RPC FAILOVER SWITCH (Production Engine)
 * Responsibilities:
 * 1. Manages Dedicated API Quotas (Alchemy, QuickNode, Reown)
 * 2. 60-second Quarantine for Rate-Limited / Exhausted Nodes (-32005, 429)
 * 3. Supplies the healthiest URL directly to rpcConfig.ts
 * ============================================================================
 */

export interface DedicatedServiceNode {
  name: string;
  url: string;
  lastFailure: number;
  failureCount: number;
}

const COOLDOWN_MS = 60 * 1000; // 60 सेकंड कूलडाउन

class SmartRpcSwitch {
  private activeIndex: number = 0;
  private failureMap: Map<string, number> = new Map();

  /**
   * .env से 3 मुख्य डेडिकेटेड सर्विसेज लोड करना
   */
  public getDedicatedNodes(chainId: 97 | 56): DedicatedServiceNode[] {
    const isTestnet = chainId === 97;
    const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '';

    // 1. Alchemy Dedicated RPC (.env)
    const alchemyUrl = isTestnet
      ? import.meta.env.VITE_ALCHEMY_BSC_TESTNET_URL
      : import.meta.env.VITE_ALCHEMY_BSC_MAINNET_URL;

    // 2. QuickNode Dedicated RPC (.env)
    const quickNodeUrl = isTestnet
      ? import.meta.env.VITE_QUICKNODE_BSC_TESTNET_URL
      : import.meta.env.VITE_QUICKNODE_BSC_MAINNET_URL;

    // 3. Reown Gateway with Project ID
    const reownUrl = isTestnet
      ? `https://rpc.walletconnect.org/v1/?chainId=eip155:97${projectId ? `&projectId=${projectId}` : ''}`
      : `https://rpc.walletconnect.org/v1/?chainId=eip155:56${projectId ? `&projectId=${projectId}` : ''}`;

    const list: DedicatedServiceNode[] = [];

    if (alchemyUrl && typeof alchemyUrl === 'string' && alchemyUrl.startsWith('http')) {
      list.push({ name: 'Alchemy_Dedicated', url: alchemyUrl.trim(), lastFailure: 0, failureCount: 0 });
    }
    if (quickNodeUrl && typeof quickNodeUrl === 'string' && quickNodeUrl.startsWith('http')) {
      list.push({ name: 'QuickNode_Dedicated', url: quickNodeUrl.trim(), lastFailure: 0, failureCount: 0 });
    }
    if (reownUrl && typeof reownUrl === 'string' && reownUrl.startsWith('http')) {
      list.push({ name: 'Reown_Gateway', url: reownUrl.trim(), lastFailure: 0, failureCount: 0 });
    }

    return list;
  }

  /**
   * एरर को डिटेक्ट करना (कोटा समाप्त या ब्लॉक)
   */
  public isQuotaOrRateLimitError(error: any): boolean {
    if (!error) return false;
    const str = String(error?.message || error?.code || JSON.stringify(error)).toLowerCase();

    return (
      str.includes('-32005') ||         // limit exceeded
      str.includes('429') ||            // too many requests
      str.includes('rate limit') ||
      str.includes('limit exceeded') ||
      str.includes('quota') ||
      str.includes('timeout') ||
      str.includes('could not coalesce error') ||
      str.includes('missing response')
    );
  }

  /**
   * फेल हुए नोड को 60 सेकंड के लिए ब्लैकलिस्ट में दर्ज करना
   */
  public markNodeFailed(url: string): void {
    if (url) {
      this.failureMap.set(url, Date.now());
      console.warn(`[SmartRpcSwitch] Node quarantined for 60s: ${url}`);
    }
  }

  /**
   * कूलडाउन चेक करके अगला स्वस्थ नोड चुनना
   */
  public selectHealthyUrl(pool: string[], failedIndex?: number): { url: string; newIndex: number } {
    if (!pool || pool.length === 0) {
      return { url: '', newIndex: 0 };
    }

    const now = Date.now();

    if (failedIndex !== undefined && pool[failedIndex]) {
      this.markNodeFailed(pool[failedIndex]);
      this.activeIndex = (failedIndex + 1) % pool.length;
    }

    // कूलडाउन चेक: जो नोड 60s से फेल नहीं हुआ है, वही चुना जाएगा
    for (let i = 0; i < pool.length; i++) {
      const candidateIndex = (this.activeIndex + i) % pool.length;
      const candidateUrl = pool[candidateIndex];
      const lastFailed = this.failureMap.get(candidateUrl) || 0;

      if (now - lastFailed > COOLDOWN_MS) {
        this.activeIndex = candidateIndex;
        return {
          url: candidateUrl,
          newIndex: this.activeIndex
        };
      }
    }

    // अगर सभी नोड्स कूलडाउन में हैं, तो जबरन अगले नोड पर बढ़ें
    this.activeIndex = (this.activeIndex + 1) % pool.length;
    return {
      url: pool[this.activeIndex] || pool[0],
      newIndex: this.activeIndex
    };
  }
}

export const smartRpcSwitch = new SmartRpcSwitch();