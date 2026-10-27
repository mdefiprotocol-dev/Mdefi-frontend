import EthereumProvider from '@walletconnect/ethereum-provider';
import { setExternalWalletProvider } from './contractProvider';

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!PROJECT_ID) {
  console.warn(
    '[WalletConnect] VITE_WALLETCONNECT_PROJECT_ID is missing from .env'
  );
}

let qrModalProvider: EthereumProvider | null = null;
let directProvider: EthereumProvider | null = null;

export async function getWalletConnectProvider(enableModal: boolean = true) {
  if (enableModal) {
    if (qrModalProvider) return qrModalProvider;
    qrModalProvider = await EthereumProvider.init({
      projectId: PROJECT_ID,
      chains: [97],
      optionalChains: [97],
      rpcMap: {
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      showQrModal: true,
      metadata: {
        name: 'MDeFi',
        description: 'MDeFi Web3 Ecosystem',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://www.mdefipro.xyz',
        icons: [
          typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://www.mdefipro.xyz/favicon.ico',
        ],
        redirect: {
          native: 'mdefi://',
          universal: 'https://mdefipro.xyz',
        },
      },
    });
    return qrModalProvider;
  } else {
    if (directProvider) return directProvider;
    directProvider = await EthereumProvider.init({
      projectId: PROJECT_ID,
      chains: [97],
      optionalChains: [97],
      rpcMap: {
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      showQrModal: false,
      metadata: {
        name: 'MDeFi',
        description: 'MDeFi Web3 Ecosystem',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://www.mdefipro.xyz',
        icons: [
          typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://www.mdefipro.xyz/favicon.ico',
        ],
        redirect: {
          native: 'mdefi://',
          universal: 'https://mdefipro.xyz',
        },
      },
    });
    return directProvider;
  }
}

export async function connectWalletConnect(): Promise<string> {
  const wcProvider = await getWalletConnectProvider();

  try {
    if (wcProvider.session) {
      await wcProvider.disconnect();
    }
    // Generic WalletConnect option ke liye normal connect
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('mdefi_active_wallet', 'walletconnect');
    }
    await wcProvider.connect();
    setExternalWalletProvider(wcProvider); 
  } catch (error) {
    console.warn('[WalletConnect] connect() failed or rejected:', error);
  }

  const accounts = wcProvider.accounts;
  if (!accounts || accounts.length === 0) {
    throw new Error('No wallet account was returned by WalletConnect.');
  }
  return accounts[0];
}

// डायरेक्ट संबंधित वॉलेट ऐप खोलने के लिए (Zero CSS Hack, Zero Crash)
export async function connectDirectWallet(walletKey: string): Promise<string> {
  const wcProvider = await getWalletConnectProvider(false);

  // Active wallet record karein taaki claim/transaction ke waqt auto-trigger ho sake
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mdefi_active_wallet', walletKey);
  }

  const handleDisplayUri = (uri: string) => {
    const encoded = encodeURIComponent(uri);
    if (walletKey === 'tokenpocket') {
      window.location.href = `tpoutside://wc?uri=${encoded}`;
    } else if (walletKey === 'metamask') {
      window.location.href = `metamask://wc?uri=${encoded}`;
    } else if (walletKey === 'trustwallet' || walletKey === 'trust') {
      window.location.href = `trust://wc?uri=${encoded}`;
    } else if (walletKey === 'bitget') {
      window.location.href = `bitkeep://wc?uri=${encoded}`;
    }
  };

  wcProvider.once('display_uri', handleDisplayUri);

  try {
    if (wcProvider.session) {
      await wcProvider.disconnect();
    }
    await wcProvider.connect();
    setExternalWalletProvider(wcProvider);
  } catch (error) {
    console.warn(`[WalletConnect] Direct connect failed for ${walletKey}:`, error);
  } finally {
    wcProvider.removeListener('display_uri', handleDisplayUri);
  }

  const accounts = wcProvider.accounts;
  if (!accounts || accounts.length === 0) {
    throw new Error('No wallet account was returned.');
  }
  return accounts[0];
}

export async function disconnectWalletConnect() {
  if (qrModalProvider) {
    try { await qrModalProvider.disconnect(); } catch (_) {}
  }
  if (directProvider) {
    try { await directProvider.disconnect(); } catch (_) {}
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('mdefi_active_wallet');
  }
  setExternalWalletProvider(null);
  qrModalProvider = null;
  directProvider = null;
}