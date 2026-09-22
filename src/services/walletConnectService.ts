import EthereumProvider from '@walletconnect/ethereum-provider';
import { setExternalWalletProvider } from './contractProvider';

const PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

if (!PROJECT_ID) {
  console.warn(
    '[WalletConnect] VITE_WALLETCONNECT_PROJECT_ID is missing from .env'
  );
}

let provider: EthereumProvider | null = null;

export async function getWalletConnectProvider() {
  if (provider) {
    return provider;
  }

  provider = await EthereumProvider.init({
    projectId: PROJECT_ID,

    // BNB Smart Chain Testnet (Chain ID: 97)
    chains: [97],
    optionalChains: [97],
    rpcMap: {
      97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    },

    // Enable WalletConnect QR / wallet selection modal
    showQrModal: true,

    metadata: {
      name: 'MDeFi',
      description: 'MDeFi Web3 Ecosystem',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://www.mdefipro.xyz',
      icons: [
        typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://www.mdefipro.xyz/favicon.ico',
      ],
    },
  });

  return provider;
}

export async function connectWalletConnect(): Promise<string> {
  const wcProvider = await getWalletConnectProvider();

  try {
    // Agar pehle se koi purana session connect reh gaya ho to fresh connection ensure karein
    if (wcProvider.session) {
      await wcProvider.disconnect();
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

export async function disconnectWalletConnect() {
  if (!provider) return;

  try {
    await provider.disconnect();
  } catch (error) {
    console.warn('[WalletConnect] disconnect failed:', error);
  }

  provider = null;
}