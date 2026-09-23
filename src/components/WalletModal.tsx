import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  Sparkles, 
  Wallet, 
  Check, 
  Radio 
} from 'lucide-react';
import { UserProfile } from '../types';
import { playClaimSuccessSound } from '../utils/successSound';
import { formatCompactAddress } from '../utils/formatAddress';
import { connectWalletConnect } from '../services/walletConnectService';
import { setExternalWalletProvider } from '../services/contractProvider';

interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, listener: (...args: unknown[]) => void): void;
  removeListener?(event: string, listener: (...args: unknown[]) => void): void;
}

interface WalletOption {
  id: string;
  name: string;
  category: string;
  description: string;
  badge?: string;
  renderIcon: () => React.ReactNode;
}

export interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  currentAddress?: string;
  mbttcBalance?: number;
  onSwitchAddress?: (address: string) => void;
  mode?: 'connect' | 'manage';
  intendedAction?: 'register' | 'login' | 'general';
  onWalletConnected?: (connectedAddress: string, walletName: string) => void;
}

const BSC_TESTNET_HEX_CHAIN_ID = '0x61';
const BSC_TESTNET_CONFIG = {
  chainId: BSC_TESTNET_HEX_CHAIN_ID,
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
    'https://bsc-testnet.bnbchain.org',
  ],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
};

const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  user,
  currentAddress,
  mbttcBalance,
  onSwitchAddress,
  intendedAction = 'general',
  onWalletConnected,
}) => {
  const [connectingWalletId, setConnectingWalletId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [connectedAddress, setConnectedAddress] = useState<string>('');
  const [selectedWalletName, setSelectedWalletName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeSessionIdRef = useRef<number>(0);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConnectingWalletId(null);
      setConnectionStatus('idle');
      setStatusMessage('');
      setErrorMessage(null);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const walletOptions: WalletOption[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      category: 'Extension & Mobile',
      description: 'Connect via browser extension or mobile app',
      badge: 'Popular',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <path d="M29.5 7.5L17.5 16.5L20 9L29.5 7.5Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.5"/>
          <path d="M2.5 7.5L14.3 16.6L12 9L2.5 7.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M25 21.5L22 26L28.5 28L30 21.7L25 21.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M2 21.7L3.5 28L10 26L7 21.5L2 21.7Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M9.5 13.5L8 16L13.8 16.3L13.5 10.5L9.5 13.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M22.5 13.5L18.4 10.4L18.1 16.3L24 16L22.5 13.5Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.5"/>
          <path d="M10 26L13.5 24.5L10.5 21.5L10 26Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5"/>
          <path d="M22 26L21.5 21.5L18.5 24.5L22 26Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.5"/>
          <path d="M13.5 24.5L16 28L18.5 24.5L21.5 21.5L10.5 21.5L13.5 24.5Z" fill="#233447" stroke="#233447" strokeWidth="0.5"/>
          <path d="M28.5 28L22 26L18.5 24.5L16 28L28.5 28Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.5"/>
          <path d="M3.5 28L16 28L13.5 24.5L10 26L3.5 28Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.5"/>
        </svg>
      ),
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      category: 'Mobile & Multi-Chain',
      description: 'Official multi-currency crypto wallet',
      badge: 'BEP-20',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#0500FF" fillOpacity="0.1"/>
          <path d="M16 4L6 8.5V16.8C6 22.8 10.3 28.3 16 29.8C21.7 28.3 26 22.8 26 16.8V8.5L16 4Z" fill="#0500FF"/>
          <path d="M16 6.5L8.5 9.8V16.5C8.5 21.2 11.7 25.5 16 26.8C20.3 25.5 23.5 21.2 23.5 16.5V9.8L16 6.5Z" fill="#00D09C"/>
        </svg>
      ),
    },
    {
      id: 'tokenpocket',
      name: 'TokenPocket',
      category: 'Mobile & Extension DApp',
      description: 'Global leading multi-chain DeFi wallet',
      badge: 'DApp Native',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2980FE"/>
          <path d="M9 10C9 8.89543 9.89543 8 11 8H20C21.6569 8 23 9.34315 23 11V13C23 14.6569 21.6569 16 20 16H13V23C13 23.5523 12.5523 24 12 24H10C9.44772 24 9 23.5523 9 23V10Z" fill="white"/>
          <rect x="15" y="18" width="8" height="6" rx="2" fill="white"/>
        </svg>
      ),
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      category: 'Scan with Any Mobile App',
      description: 'Connect with 100+ compatible mobile crypto wallets',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#3B99FC" fillOpacity="0.15"/>
          <path d="M9 13C12.8 9.2 19.2 9.2 23 13L23.7 13.7C23.9 13.9 23.9 14.3 23.7 14.5L21.8 16.4C21.7 16.5 21.5 16.5 21.4 16.4L20.5 15.5C18 13 14 13 11.5 15.5L10.6 16.4C10.5 16.5 10.3 16.5 10.2 16.4L8.3 14.5C8.1 14.3 8.1 13.9 8.3 13.7L9 13ZM26.8 16.8L28.5 18.5C28.7 18.7 28.7 19.1 28.5 19.3L20.8 27C20.6 27.2 20.2 27.2 20 27L16 23C15.9 22.9 15.7 22.9 15.6 23L11.6 27C11.4 27.2 11 27.2 10.8 27L3.1 19.3C2.9 19.1 2.9 18.7 3.1 18.5L4.8 16.8C5 16.6 5.4 16.6 5.6 16.8L9.6 20.8C9.7 20.9 9.9 20.9 10 20.8L14 16.8C14.2 16.6 14.6 16.6 14.8 16.8L18.8 20.8C18.9 20.9 19.1 20.9 19.2 20.8L23.2 16.8C23.4 16.6 23.8 16.6 24 16.8L26.8 16.8Z" fill="#3B99FC"/>
        </svg>
      ),
    },
    {
      id: 'bitget',
      name: 'Bitget Wallet',
      category: 'Web3 Trading & Swap',
      description: 'Faster multi-chain decentralized crypto wallet',
      badge: 'Fast Gas',
      renderIcon: () => (
        <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#00F0FF" fillOpacity="0.1"/>
          <path d="M7 11.5L16 6L25 11.5V20.5L16 26L7 20.5V11.5Z" fill="#18181B" stroke="#00F0FF" strokeWidth="1.5"/>
          <path d="M12 14L16 11.5L20 14V18L16 20.5L12 18V14Z" fill="#00F0FF"/>
        </svg>
      ),
    },
  ];

  const ensureBscTestnetChain = async (rawProvider: EIP1193Provider): Promise<void> => {
    try {
      await rawProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_TESTNET_HEX_CHAIN_ID }],
      });
    } catch (switchError: unknown) {
      const err = switchError as { code?: number };
      if (err?.code === 4902) {
        await rawProvider.request({
          method: 'wallet_addEthereumChain',
          params: [BSC_TESTNET_CONFIG],
        });
      } else {
        throw switchError;
      }
    }

    const currentChainId = (await rawProvider.request({
      method: 'eth_chainId',
    })) as string;

    const normalizedChainId = String(currentChainId).toLowerCase();
    if (normalizedChainId !== BSC_TESTNET_HEX_CHAIN_ID && normalizedChainId !== '0x061' && normalizedChainId !== '97') {
      throw new Error('Please confirm and switch your wallet network to BNB Smart Chain Testnet (Chain ID: 97).');
    }
  };

  const getSpecificProvider = (id: string): EIP1193Provider | null => {
    if (typeof window === 'undefined') return null;
    const w = window as unknown as {
      ethereum?: {
        isMetaMask?: boolean;
        isTrust?: boolean;
        isTokenPocket?: boolean;
        providers?: Array<{
          isMetaMask?: boolean;
          isTrust?: boolean;
          isTokenPocket?: boolean;
          isBitKeep?: boolean;
          isBitget?: boolean;
          request?: EIP1193Provider['request'];
        }>;
        request?: EIP1193Provider['request'];
      };
      trustwallet?: { ethereum?: EIP1193Provider };
      tokenpocket?: { ethereum?: EIP1193Provider };
      bitkeep?: { ethereum?: EIP1193Provider };
      bitget?: { ethereum?: EIP1193Provider };
    };

    if (id === 'metamask') {
      if (w.ethereum?.isMetaMask && !w.ethereum?.isTokenPocket && !w.ethereum?.isTrust) {
        return w.ethereum as unknown as EIP1193Provider;
      }
      if (Array.isArray(w.ethereum?.providers)) {
        const found = w.ethereum.providers.find(
          (p) => Boolean(p?.isMetaMask) && !p?.isTokenPocket && !p?.isTrust
        );
        if (found && typeof found.request === 'function') return found as unknown as EIP1193Provider;
      }
      return null;
    }

    if (id === 'trustwallet') {
      if (w.trustwallet?.ethereum && typeof w.trustwallet.ethereum.request === 'function') {
        return w.trustwallet.ethereum;
      }
      if (w.ethereum?.isTrust && typeof w.ethereum.request === 'function') {
        return w.ethereum as unknown as EIP1193Provider;
      }
      if (Array.isArray(w.ethereum?.providers)) {
        const found = w.ethereum.providers.find((p) => Boolean(p?.isTrust));
        if (found && typeof found.request === 'function') return found as unknown as EIP1193Provider;
      }
      return null;
    }

    if (id === 'tokenpocket') {
      if (w.tokenpocket?.ethereum && typeof w.tokenpocket.ethereum.request === 'function') {
        return w.tokenpocket.ethereum;
      }
      if (w.ethereum?.isTokenPocket && typeof w.ethereum.request === 'function') {
        return w.ethereum as unknown as EIP1193Provider;
      }
      if (Array.isArray(w.ethereum?.providers)) {
        const found = w.ethereum.providers.find((p) => Boolean(p?.isTokenPocket));
        if (found && typeof found.request === 'function') return found as unknown as EIP1193Provider;
      }
      return null;
    }

    if (id === 'bitget') {
      if (w.bitkeep?.ethereum && typeof w.bitkeep.ethereum.request === 'function') {
        return w.bitkeep.ethereum;
      }
      if (w.bitget?.ethereum && typeof w.bitget.ethereum.request === 'function') {
        return w.bitget.ethereum;
      }
      if (Array.isArray(w.ethereum?.providers)) {
        const found = w.ethereum.providers.find((p) => Boolean(p?.isBitKeep || p?.isBitget));
        if (found && typeof found.request === 'function') return found as unknown as EIP1193Provider;
      }
      return null;
    }

    return null;
  };

  const isMobileEnvironment = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobileUa || (hasTouch && window.innerWidth <= 768);
  };

  const triggerWalletDeepLink = (walletId: string): boolean => {
    if (typeof window === 'undefined') return false;
    const currentHref = window.location.href;
    const cleanUrl = currentHref.replace(/^https?:\/\//, '');

    if (walletId === 'metamask') {
      window.location.href = `https://metamask.app.link/dapp/${cleanUrl}`;
      return true;
    }
    if (walletId === 'trustwallet') {
      window.location.href = `https://link.trustwallet.com/open_url?coin_id=20000714&url=${encodeURIComponent(currentHref)}`;
      return true;
    }
    if (walletId === 'tokenpocket') {
      const tpParams = { url: currentHref, chain: 'BSC' };
      window.location.href = `tpdapp://open?params=${encodeURIComponent(JSON.stringify(tpParams))}`;
      return true;
    }
    if (walletId === 'bitget') {
      window.location.href = `bitkeep://bkconnect?action=dapp&url=${encodeURIComponent(currentHref)}`;
      return true;
    }
    return false;
  };

  const handleConnect = async (wallet: WalletOption) => {
    const currentSessionId = Date.now();
    activeSessionIdRef.current = currentSessionId;

    setConnectingWalletId(wallet.id);
    setSelectedWalletName(wallet.name);
    setConnectionStatus('connecting');
    setErrorMessage(null);

    try {
      let resolvedAddress: string;

      if (wallet.id === 'walletconnect') {
        setStatusMessage('Connecting via WalletConnect...');
        resolvedAddress = await connectWalletConnect();

        if (activeSessionIdRef.current !== currentSessionId) return;

        if (!resolvedAddress || !isValidEthereumAddress(resolvedAddress)) {
          throw new Error('Wallet connection timed out or did not return a valid address.');
        }

        setConnectedAddress(resolvedAddress);
        setConnectionStatus('connected');
        setStatusMessage('Connected via WalletConnect (Verified)');

        try {
          playClaimSuccessSound();
        } catch {}

        successTimeoutRef.current = setTimeout(() => {
          if (activeSessionIdRef.current !== currentSessionId) return;
          if (onWalletConnected) {
            onWalletConnected(resolvedAddress, 'WalletConnect');
          }
          if (onSwitchAddress) {
            onSwitchAddress(resolvedAddress);
          }
          onClose();
        }, 700);
        return;
      }

      const injectedProvider = getSpecificProvider(wallet.id);

      if (injectedProvider && typeof injectedProvider.request === 'function') {
        setStatusMessage(`Authorizing ${wallet.name} on BSC Testnet...`);

        const accounts = (await injectedProvider.request({
          method: 'eth_requestAccounts',
        })) as string[];

        if (activeSessionIdRef.current !== currentSessionId) return;

        if (!Array.isArray(accounts) || !accounts[0] || !isValidEthereumAddress(accounts[0])) {
          throw new Error(`No valid BSC account unlocked in ${wallet.name}.`);
        }

        setStatusMessage('Verifying BNB Smart Chain Testnet...');
        await ensureBscTestnetChain(injectedProvider);

        if (activeSessionIdRef.current !== currentSessionId) return;

        setExternalWalletProvider(injectedProvider);
        resolvedAddress = accounts[0];

        setConnectedAddress(resolvedAddress);
        setConnectionStatus('connected');
        setStatusMessage(`Connected via ${wallet.name} (Verified)`);

        try {
          playClaimSuccessSound();
        } catch {}

        successTimeoutRef.current = setTimeout(() => {
          if (activeSessionIdRef.current !== currentSessionId) return;
          if (onWalletConnected) {
            onWalletConnected(resolvedAddress, wallet.name);
          }
          if (onSwitchAddress) {
            onSwitchAddress(resolvedAddress);
          }
          onClose();
        }, 700);
      } else {
        if (isMobileEnvironment()) {
          setStatusMessage(`Opening ${wallet.name} App...`);
          const opened = triggerWalletDeepLink(wallet.id);
          if (opened) {
            successTimeoutRef.current = setTimeout(() => {
              if (activeSessionIdRef.current !== currentSessionId) return;
              setConnectionStatus('idle');
              setConnectingWalletId(null);
            }, 3000);
            return;
          }
        }

        const walletErrors: Record<string, string> = {
          metamask: 'MetaMask was not detected. Please open MDeFi in MetaMask or install MetaMask.',
          trustwallet: "Trust Wallet was not detected. Please open MDeFi inside Trust Wallet's DApp browser.",
          tokenpocket: "TokenPocket was not detected. Please open MDeFi inside TokenPocket's DApp browser.",
          bitget: "Bitget Wallet was not detected. Please open MDeFi inside Bitget Wallet's DApp browser.",
        };

        throw new Error(
          walletErrors[wallet.id] || `${wallet.name} was not detected. Please open MDeFi inside ${wallet.name}'s DApp browser or select WalletConnect.`
        );
      }
    } catch (err: unknown) {
      if (activeSessionIdRef.current !== currentSessionId) return;

      const rawError = err as { code?: number; message?: string };
      let errorText = 'Connection request failed.';

      if (rawError?.code === 4001 || rawError?.message?.includes('User rejected')) {
        errorText = 'Connection request was cancelled or rejected by user.';
      } else if (rawError?.message) {
        errorText = rawError.message;
      }

      setConnectionStatus('error');
      setErrorMessage(errorText);
      setConnectingWalletId(null);
    }
  };

  const shorten = (addr: string) => {
    return formatCompactAddress(addr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl select-none overflow-y-auto">
      <div 
        className="relative w-full max-w-lg my-auto max-h-[92vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#091811] via-[#05110a] to-[#030906] border-2 border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.35)] p-4 sm:p-7 space-y-4 sm:space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Connect Web3 Wallet
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                BNB Smart Chain Testnet (Chain ID: 97)
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {user && (
          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-zinc-200 block">Active Connected Wallet</span>
                <span className="text-[11px] font-mono text-emerald-400">{shorten(currentAddress || user.walletAddress || '')}</span>
                {mbttcBalance !== undefined && (
                  <span className="text-[10px] text-zinc-400 block font-mono">
                    {mbttcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} MBTTC
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-500/30 shrink-0">
              Active
            </span>
          </div>
        )}

        {!user && intendedAction === 'register' && (
          <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Step 1 of 3: Connect Web3 Wallet</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-900/60 shrink-0">
              Registration
            </span>
          </div>
        )}

        {!user && intendedAction === 'login' && (
          <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="truncate">Connect wallet to access dashboard</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-900/60 shrink-0">
              Account Login
            </span>
          </div>
        )}

        {connectionStatus === 'connecting' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 via-[#071910] to-zinc-950 border border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.25)] text-center space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-teal-300 animate-spin" />
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                {statusMessage.includes('Connecting via WalletConnect') 
                  ? 'Connecting via WalletConnect...' 
                  : statusMessage.includes('Opening')
                  ? statusMessage
                  : `Authorizing ${selectedWalletName}...`}
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-mono">
              {statusMessage}
            </p>
          </div>
        )}

        {connectionStatus === 'connected' && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.35)] text-center space-y-2 animate-in zoom-in-95">
            <div className="flex items-center justify-center gap-2 text-emerald-300 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Wallet Connected Successfully!</span>
            </div>
            <div className="text-xs font-mono text-white font-bold">
              {shorten(connectedAddress)}
            </div>
          </div>
        )}

        {connectionStatus === 'error' && errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-300 flex items-start justify-between gap-3 animate-in fade-in-50">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Connection Failed</span>
                <span className="text-[11px] text-rose-300/90">{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setConnectionStatus('idle')}
              className="px-2.5 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-white font-mono text-[10px] uppercase font-bold shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        <div className="space-y-2.5 relative z-10">
          <span className="text-[11px] font-mono text-zinc-400 font-bold uppercase tracking-wider block">
            Select Web3 Wallet Provider
          </span>

          <div className="space-y-2">
            {walletOptions.map((wallet) => {
              const isConnecting = connectingWalletId === wallet.id && connectionStatus === 'connecting';
              const isConnected = connectingWalletId === wallet.id && connectionStatus === 'connected';

              return (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet)}
                  disabled={connectionStatus === 'connecting'}
                  className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 group text-left cursor-pointer ${
                    isConnecting 
                      ? 'bg-emerald-950/50 border-emerald-400 ring-2 ring-emerald-500/20'
                      : isConnected
                      ? 'bg-emerald-950 border-emerald-400'
                      : 'bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  } disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      {wallet.renderIcon()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {wallet.name}
                        </h4>
                        {wallet.badge && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 shrink-0">
                            {wallet.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400 block truncate">
                        {wallet.description}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isConnecting ? (
                      <div className="relative w-5 h-5 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                      </div>
                    ) : isConnected ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-zinc-800/80 flex items-start gap-2.5 text-[11px] text-zinc-400 leading-relaxed relative z-10">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-zinc-300">100% Non-Custodial:</strong> Connecting your wallet only shares your public address. MDeFi smart contracts never request your private keys or seed phrase.
          </p>
        </div>
      </div>
    </div>
  );
};