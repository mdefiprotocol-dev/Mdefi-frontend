import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowUpDown, 
  Settings, 
  RefreshCw, 
  Info, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ChevronDown, 
  Check, 
  Clock, 
  Zap,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { getSharedRpcProvider } from '../config/rpcConfig';
import { MbttcSwapSuccessModal } from './MbttcSwapSuccessModal';
import { Rotating3DMbttcCoin } from './common/Rotating3DMbttcCoin';
import { Rotating3DUsdtCoin } from './common/Rotating3DUsdtCoin';
import { MarketStats, mbttcMarketService } from '../services/mbttcMarketService';
import { CONTRACT_ADDRESSES } from '../config/contractConfig';
import { ethers } from 'ethers';

export type SwapToken = 'MBTTC' | 'USDT';

interface MbttcSwapSectionProps {
  mbttcBalance: number;
  usdtBalance?: number;
  walletAddress?: string;
  selectedAction?: 'BUY' | 'SELL' | null;
  onExecuteSwap: (params: {
    fromToken: SwapToken;
    toToken: SwapToken;
    fromAmount: number;
    toAmount: number;
    slippage: number;
  }) => Promise<{ success: boolean; txHash: string; message?: string }>;
  onOpenWalletModal?: () => void;
}

export const MbttcSwapSection: React.FC<MbttcSwapSectionProps> = ({
  mbttcBalance: propMbttcBalance,
  usdtBalance: propUsdtBalance = 0.00,
  walletAddress,
  selectedAction,
  onExecuteSwap,
  onOpenWalletModal,
}) => {
  // 100% Live On-Chain Balances State
  const [liveMbttcBal, setLiveMbttcBal] = useState<number>(propMbttcBalance || 0);
  const [liveUsdtBal, setLiveUsdtBal] = useState<number>(propUsdtBalance || 0);

  // Live Wallet Balance Fetcher from BSC Testnet RPC
  useEffect(() => {
    let isMounted = true;
    const fetchLiveBalances = async () => {
      if (!walletAddress || !ethers.isAddress(walletAddress)) return;
      try {
        const provider = getSharedRpcProvider();
        const erc20Abi = ['function balanceOf(address) view returns (uint256)'];

        const mbttcAddress = (CONTRACT_ADDRESSES as any)?.mbttcToken;
        const usdtAddress = (CONTRACT_ADDRESSES as any)?.usdtToken || (CONTRACT_ADDRESSES as any)?.usdt;

        const calls: Promise<any>[] = [];
        if (mbttcAddress && ethers.isAddress(mbttcAddress)) {
          const mbttcContract = new ethers.Contract(mbttcAddress, erc20Abi, provider);
          calls.push(mbttcContract.balanceOf(walletAddress).catch(() => 0n));
        } else {
          calls.push(Promise.resolve(0n));
        }

        if (usdtAddress && ethers.isAddress(usdtAddress)) {
          const usdtContract = new ethers.Contract(usdtAddress, erc20Abi, provider);
          calls.push(usdtContract.balanceOf(walletAddress).catch(() => 0n));
        } else {
          calls.push(Promise.resolve(0n));
        }

        const [rawMbttc, rawUsdt] = await Promise.all(calls);
        if (isMounted) {
          if (rawMbttc !== undefined) {
            setLiveMbttcBal(parseFloat(ethers.formatUnits(rawMbttc.toString(), 18)));
          }
          if (rawUsdt !== undefined) {
            setLiveUsdtBal(parseFloat(ethers.formatUnits(rawUsdt.toString(), 18)));
          }
        }
      } catch (err) {
        console.warn('[MbttcSwapSection] Live balance fetch error:', err);
      }
    };

    fetchLiveBalances();
    const timer = setInterval(fetchLiveBalances, 20000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [walletAddress]);

  // Sync with props if updated externally
  useEffect(() => {
    if (propMbttcBalance && propMbttcBalance > 0) setLiveMbttcBal(propMbttcBalance);
  }, [propMbttcBalance]);

  const mbttcBalance = liveMbttcBal;
  const usdtBalance = liveUsdtBal;

  // Swap state
  const [fromToken, setFromToken] = useState<SwapToken>('MBTTC');
  const [payAmountStr, setPayAmountStr] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(0.5);
  const [customSlippage, setCustomSlippage] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapError, setSwapError] = useState<string>('');
  const [pulseHighlight, setPulseHighlight] = useState<boolean>(false);

  // Market stats & mode from service
  const [stats, setStats] = useState<MarketStats>(mbttcMarketService.getMarketStatsSync());

  useEffect(() => {
    const unsubscribe = mbttcMarketService.subscribe((updated) => {
      setStats(updated);
    });
    return unsubscribe;
  }, []);

  // Sync external BUY/SELL action when requested from TradeBar or Chart
  useEffect(() => {
    if (selectedAction === 'BUY') {
      setFromToken('USDT');
      setPayAmountStr('');
      setSwapError('');
      triggerHighlight();
    } else if (selectedAction === 'SELL') {
      setFromToken('MBTTC');
      setPayAmountStr('');
      setSwapError('');
      triggerHighlight();
    }
  }, [selectedAction]);

  const triggerHighlight = () => {
    setPulseHighlight(true);
    setTimeout(() => setPulseHighlight(false), 1500);
  };

  // Phase 7 Cyber Notice Modal State
  const [showPhase7Notice, setShowPhase7Notice] = useState<boolean>(false);

  // Direction rotation animation trigger
  const [rotateDeg, setRotateDeg] = useState<number>(0);

  // Success Modal State
  const [successModalData, setSuccessModalData] = useState<{
    isOpen: boolean;
    fromToken: string;
    fromAmount: number;
    toToken: string;
    toAmount: number;
    txHash: string;
  }>({
    isOpen: false,
    fromToken: 'MBTTC',
    fromAmount: 0,
    toToken: 'USDT',
    toAmount: 0,
    txHash: '',
  });

  // Derived toToken (strictly only MBTTC or USDT allowed)
  const toToken: SwapToken = fromToken === 'MBTTC' ? 'USDT' : 'MBTTC';

  // Target Launch Price for Phase 7: 3.50 USDT
  const TARGET_LAUNCH_PRICE = 3.50;
  const isLive = stats.isLive;

  // Exchange rate: If live on-chain DEX price exists use it, otherwise target launch 3.50 USDT
  const mbttcToUsdtRate = isLive && stats.price > 0 ? stats.price : TARGET_LAUNCH_PRICE;
  const usdtToMbttcRate = 1 / mbttcToUsdtRate;

  const rate = fromToken === 'MBTTC' ? mbttcToUsdtRate : usdtToMbttcRate;

  // Numerical pay amount
  const payAmountNum = parseFloat(payAmountStr) || 0;

  // Calculated receive amount
  const receiveAmountNum = useMemo(() => {
    if (payAmountNum <= 0) return 0;
    return payAmountNum * rate;
  }, [payAmountNum, rate]);

  // Current balance of source token
  const currentSourceBalance = fromToken === 'MBTTC' ? mbttcBalance : usdtBalance;
  const currentTargetBalance = toToken === 'MBTTC' ? mbttcBalance : usdtBalance;

  // Active slippage value
  const activeSlippage = customSlippage ? parseFloat(customSlippage) || 0.5 : slippage;

  // Minimum received after slippage
  const minReceived = useMemo(() => {
    if (receiveAmountNum <= 0) return 0;
    return receiveAmountNum * (1 - activeSlippage / 100);
  }, [receiveAmountNum, activeSlippage]);

  // Switch direction
  const handleToggleDirection = () => {
    setRotateDeg((prev) => prev + 180);
    setFromToken((prev) => (prev === 'MBTTC' ? 'USDT' : 'MBTTC'));
    setPayAmountStr('');
    setSwapError('');
  };

  // Set BUY tab (paying USDT to get MBTTC)
  const handleSelectBuyTab = () => {
    setFromToken('USDT');
    setPayAmountStr('');
    setSwapError('');
  };

  // Set SELL tab (paying MBTTC to get USDT)
  const handleSelectSellTab = () => {
    setFromToken('MBTTC');
    setPayAmountStr('');
    setSwapError('');
  };

  // Quick percent click
  const handleSetPercent = (percent: number) => {
    const val = (currentSourceBalance * percent).toFixed(fromToken === 'MBTTC' ? 0 : 2);
    setPayAmountStr(val);
    setSwapError('');
  };

  // Handle Token Approval
  const handleApprove = async () => {
    setIsApproving(true);
    setSwapError('');
    await new Promise((r) => setTimeout(r, 800));
    setIsApproving(false);
    setIsApproved(true);
  };

  // Handle Swap Execution
  const handleStartSwap = async () => {
    if (payAmountNum <= 0 || payAmountNum > currentSourceBalance) return;
    setIsSwapping(true);
    setSwapError('');

    try {
      const res = await onExecuteSwap({
        fromToken,
        toToken,
        fromAmount: payAmountNum,
        toAmount: receiveAmountNum,
        slippage: activeSlippage,
      });

      if (res.success && res.txHash) {
        setSuccessModalData({
          isOpen: true,
          fromToken,
          fromAmount: payAmountNum,
          toToken,
          toAmount: receiveAmountNum,
          txHash: res.txHash,
        });
        setPayAmountStr('');
      } else {
        setSwapError(res.message || 'Transaction rejected by user');
      }
    } catch (err: any) {
      setSwapError(err?.message || 'Swap transaction failed');
    } finally {
      setIsSwapping(false);
    }
  };

  const isBuyMode = fromToken === 'USDT';

  // Determine button state and label
  const getButtonState = () => {
    if (!walletAddress) {
      return {
        label: 'CONNECT WALLET',
        disabled: false,
        action: onOpenWalletModal || (() => {}),
        isPrimary: false,
      };
    }
    if (payAmountNum <= 0) {
      return {
        label: isBuyMode ? 'ENTER USDT AMOUNT TO BUY MBTTC' : 'ENTER MBTTC AMOUNT TO SELL',
        disabled: true,
        action: () => {},
        isPrimary: false,
      };
    }
    if (payAmountNum > currentSourceBalance) {
      return {
        label: `INSUFFICIENT ${fromToken} BALANCE`,
        disabled: true,
        action: () => {},
        isPrimary: false,
      };
    }
    if (!isApproved) {
      return {
        label: isApproving ? `APPROVING ${fromToken}...` : `APPROVE ${fromToken}`,
        disabled: isApproving,
        action: handleApprove,
        isPrimary: true,
      };
    }
    if (isSwapping) {
      return {
        label: isLive ? 'EXECUTING ON-CHAIN DEX SWAP...' : 'ROUTING PANCAKESWAP TEST SWAP...',
        disabled: true,
        action: () => {},
        isPrimary: true,
      };
    }

    const actionText = isBuyMode ? 'BUY MBTTC' : 'SELL MBTTC';
    return {
      label: isLive 
        ? `${actionText} (PANCAKESWAP V2)` 
        : `${actionText} (PHASE 7 PANCAKESWAP)`,
      disabled: false,
      action: () => setShowPhase7Notice(true),
      isPrimary: true,
    };
  };

  const buttonState = getButtonState();

  return (
    <div 
      id="mbttc-swap-section"
      className={`relative rounded-3xl bg-gradient-to-b from-[#0c1812] via-[#08120d] to-[#060a08] border p-5 sm:p-7 shadow-[0_0_40px_rgba(16,185,129,0.08)] overflow-hidden transition-all duration-300 ${
        pulseHighlight 
          ? 'border-emerald-400 ring-4 ring-emerald-500/20' 
          : 'border-emerald-500/30'
      }`}
    >
      {/* Background Energy Glow */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-950/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 font-mono">
              <span>MBTTC TOKEN SWAP</span>
              {isLive ? (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold">
                  LIVE DEX
                </span>
              ) : (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PHASE 7 DEX ROUTER
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400">
              Direct PancakeSwap V2 AMM router integration deploying in Phase 7 on BNB Smart Chain.
            </p>
          </div>
        </div>

        {/* Binance-Inspired Buy / Sell Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-zinc-800">
            <button
              type="button"
              onClick={handleSelectBuyTab}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                isBuyMode
                  ? 'bg-[#0ECB81] text-black shadow-[0_0_12px_rgba(14,203,129,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>BUY MBTTC</span>
            </button>
            <button
              type="button"
              onClick={handleSelectSellTab}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                !isBuyMode
                  ? 'bg-[#F6465D] text-white shadow-[0_0_12px_rgba(246,70,93,0.35)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>SELL MBTTC</span>
            </button>
          </div>

          {/* Slippage Settings Toggle */}
          <button
            onClick={() => setIsSettingsOpen((s) => !s)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isSettingsOpen
                ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                : 'bg-zinc-900/80 text-zinc-400 hover:text-white border-zinc-800'
            }`}
            title="Swap Slippage Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Integration Notice Banner */}
      <div className="relative z-10 mt-3">
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold">● PANCAKESWAP V2 ROUTER</span>
            <span className="text-zinc-300 hidden sm:inline">&bull; Direct liquidity pool pairing unlocks in Phase 7 at Target Launch Valuation.</span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold self-start sm:self-auto">
            Target Price: $3.50 USDT
          </span>
        </div>
      </div>

      {/* Slippage Settings Drawer */}
      {isSettingsOpen && (
        <div className="relative z-10 mt-3 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-300 font-medium">Slippage Tolerance</span>
            <span className="font-mono text-emerald-400 font-semibold">{activeSlippage}%</span>
          </div>
          <div className="flex items-center gap-2">
            {[0.1, 0.5, 1.0].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSlippage(preset);
                  setCustomSlippage('');
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  slippage === preset && !customSlippage
                    ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {preset}%
              </button>
            ))}
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Custom"
                value={customSlippage}
                onChange={(e) => setCustomSlippage(e.target.value)}
                className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-white text-center focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-2 top-1.5 text-xs text-zinc-500 font-mono">%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Swap Container */}
      <div className="relative z-10 mt-4 space-y-2">
        {/* INPUT 1: YOU PAY */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 focus-within:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">You Pay</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span>Balance:</span>
              <span className="text-zinc-200 font-semibold">
                {currentSourceBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-400 font-bold">{fromToken}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={payAmountStr}
              onChange={(e) => {
                setPayAmountStr(e.target.value);
                setSwapError('');
              }}
              className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold font-mono text-white placeholder-zinc-600 focus:outline-none"
            />

            {/* Token Selector Pill with 3D Animated Coins */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-white font-mono font-bold text-sm shadow-inner">
                {fromToken === 'MBTTC' ? (
                  <Rotating3DMbttcCoin size={22} accent="emerald" />
                ) : (
                  <Rotating3DUsdtCoin size={22} glow={false} />
                )}
                <span className="tracking-wide">{fromToken}</span>
              </div>
            </div>
          </div>

          {/* Quick Percentage Chips */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleSetPercent(pct)}
                  className="px-2 py-0.5 rounded-md bg-zinc-900/90 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 text-[11px] font-mono border border-zinc-800 transition-all cursor-pointer"
                >
                  {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-400">
              ≈ ${(payAmountNum * (fromToken === 'MBTTC' ? mbttcToUsdtRate : 1)).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Swap Switcher Button */}
        <div className="flex justify-center -my-2 relative z-20">
          <button
            onClick={handleToggleDirection}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-emerald-400 hover:text-white hover:border-emerald-500 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Invert Token Pair"
          >
            <ArrowUpDown 
              className="w-4 h-4 transition-transform duration-300"
              style={{ transform: `rotate(${rotateDeg}deg)` }}
            />
          </button>
        </div>

        {/* INPUT 2: YOU RECEIVE */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-medium">You Receive (Estimated)</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span>Balance:</span>
              <span className="text-zinc-200 font-semibold">
                {currentTargetBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-emerald-400 font-bold">{toToken}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              {receiveAmountNum > 0
                ? receiveAmountNum.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })
                : '0.00'}
            </div>

            {/* Target Token Pill with 3D Animated Coins */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800/90 text-white font-mono font-bold text-sm shadow-inner">
                {toToken === 'MBTTC' ? (
                  <Rotating3DMbttcCoin size={22} accent="emerald" />
                ) : (
                  <Rotating3DUsdtCoin size={22} glow={false} />
                )}
                <span className="tracking-wide">{toToken}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/60 text-xs font-mono text-zinc-400">
            <span>Minimum Received (after {activeSlippage}% slippage):</span>
            <span className="text-zinc-200 font-medium">
              {minReceived.toFixed(2)} {toToken}
            </span>
          </div>
        </div>
      </div>

      {/* Routing & Protocol Settlement Breakdown */}
      <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/70 space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Target Exchange Rate:</span>
          <span className="text-emerald-400 font-bold">
            1 MBTTC = ${mbttcToUsdtRate.toFixed(2)} USDT
          </span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Network & Settlement Fee:</span>
          <span className="text-emerald-400">0.00% (Protocol Subsidized)</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Execution Contract:</span>
          <span className="text-zinc-200">
            PancakeSwap V2 Router (0x10ED43C7...B835cb2)
          </span>
        </div>
      </div>

      {/* Error Message if any */}
      {swapError && (
        <div className="relative z-10 mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{swapError}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="relative z-10 mt-4">
        <button
          onClick={buttonState.action}
          disabled={buttonState.disabled}
          className={`w-full py-4 px-6 rounded-2xl font-mono text-sm font-black tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
            buttonState.disabled
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
              : isBuyMode
                ? 'bg-[#0ECB81] hover:bg-[#0bb875] text-black shadow-[0_0_25px_rgba(14,203,129,0.35)] active:scale-98'
                : 'bg-[#F6465D] hover:bg-[#e03d52] text-white shadow-[0_0_25px_rgba(246,70,93,0.35)] active:scale-98'
          }`}
        >
          {isSwapping && <RefreshCw className="w-4 h-4 animate-spin" />}
          <span>{buttonState.label}</span>
        </button>
      </div>

      {/* Success Modal */}
      <MbttcSwapSuccessModal
        isOpen={successModalData.isOpen}
        onClose={() => setSuccessModalData((prev) => ({ ...prev, isOpen: false }))}
        fromToken={successModalData.fromToken}
        fromAmount={successModalData.fromAmount}
        toToken={successModalData.toToken}
        toAmount={successModalData.toAmount}
        txHash={successModalData.txHash}
      />

      {/* ========================================================================= */}
      {/* PHASE 7 WEB3 CYBER PROTOCOL MODAL POPUP                                  */}
      {/* ========================================================================= */}
      {showPhase7Notice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0a1812] via-[#07130e] to-[#040906] border border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.3)] overflow-hidden">
            {/* Ambient Core Lighting */}
            <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header with 3D Medallions */}
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <Rotating3DMbttcCoin size={34} accent="emerald" />
                  <Rotating3DUsdtCoin size={34} glow={false} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-mono tracking-tight uppercase">
                    Protocol Trading Gateway
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    PancakeSwap V2 DEX Liquidity
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPhase7Notice(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Official Announcement Body */}
            <div className="relative z-10 py-6 space-y-4 font-mono">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400">Current Protocol Phase:</span>
                  <span className="text-emerald-400 font-bold bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Phase 1 — Live Minting
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-800/80">
                  <span className="text-zinc-400">Target Launch Price:</span>
                  <span className="text-emerald-300 font-extrabold text-sm">
                    1 MBTTC = $3.50 USDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">AMM DEX Partner:</span>
                  <span className="text-teal-300 font-semibold flex items-center gap-1">
                    PancakeSwap V2 (BNB Chain)
                  </span>
                </div>
              </div>

              {/* Exact Official Message */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-zinc-950 border border-emerald-500/40 text-xs sm:text-sm text-zinc-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Official Protocol Notice</span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-zinc-300">
                  Phase 1 Token Minting is Live. PancakeSwap DEX Liquidity &amp; Trading activates in Phase 7 at Target Price $3.50 USDT. Please wait for official launch.
                </p>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="relative z-10 pt-2 flex flex-col sm:flex-row gap-2.5 font-mono">
              <button
                type="button"
                onClick={() => setShowPhase7Notice(false)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer active:scale-95 text-center"
              >
                Acknowledge &amp; Wait for Phase 7
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};