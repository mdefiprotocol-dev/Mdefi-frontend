import EthereumProvider from '@walletconnect/ethereum-provider';

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

    // BNB Smart Chain
    chains: [56],

    // Enable WalletConnect QR / wallet selection modal
    showQrModal: true,

    metadata: {
      name: 'MDeFi',
      description: 'MDeFi Web3 Ecosystem',
      url: window.location.origin,
      icons: [
        `${window.location.origin}/favicon.ico`,
      ],
    },
  });

  return provider;
}

export async function connectWalletConnect(): Promise<string> {
  const wcProvider = await getWalletConnectProvider();

  try {
    await wcProvider.connect();
  } catch (error) {
    console.warn('[WalletConnect] connect() failed:', error);
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