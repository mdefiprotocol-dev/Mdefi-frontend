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
  CheckCircle2
} from 'lucide-react';
import { MbttcCoin3D } from './MbttcCoin3D';
import { MbttcSwapSuccessModal } from './MbttcSwapSuccessModal';
import { MarketStats, mbttcMarketService } from '../services/mbttcMarketService';

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
  mbttcBalance,
  usdtBalance = 450.00,
  walletAddress,
  selectedAction,
  onExecuteSwap,
  onOpenWalletModal,
}) => {
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

  // Exchange rate: 1 MBTTC = stats.price USDT
  const mbttcToUsdtRate = stats.price;
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
        // Confirmation confirmed: Trigger success modal
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

  const isLive = stats.isLive;
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
        label: isLive ? 'EXECUTING ON-CHAIN DEX SWAP...' : 'SIMULATING DEMO SWAP...',
        disabled: true,
        action: () => {},
        isPrimary: true,
      };
    }

    const actionText = isBuyMode ? 'BUY MBTTC' : 'SELL MBTTC';
    return {
      label: isLive 
        ? `${actionText} (ON-CHAIN DEX)`
        : `${actionText} (DEMO PREVIEW)`,
      disabled: false,
      action: handleStartSwap,
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
      {/* Background Energy Flow Particles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-950/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
            <RefreshCw className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>MBTTC TOKEN SWAP</span>
              {isLive ? (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold">
                  LIVE DEX
                </span>
              ) : (
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-semibold">
                  DEMO PREVIEW
                </span>
              )}
            </h2>
            <p className="text-xs text-zinc-400">
              {isLive 
                ? 'PancakeSwap V2 / BSC on-chain router execution'
                : 'Direct preview interface before AMM liquidity pool deployment'}
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
        {isLive ? (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono font-semibold">● LIVE ON-CHAIN DEX SWAP</span>
              <span className="text-zinc-300 hidden sm:inline">&bull; Orders execute directly through BNB Smart Chain liquidity contracts.</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400">
              Live AMM
            </span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono font-semibold">● DEMO SWAP PREVIEW</span>
              <span className="text-zinc-400 hidden sm:inline">&bull; Trading integration will become available when the connected liquidity/DEX contract is live.</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              Simulated Mode
            </span>
          </div>
        )}
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

            {/* Token Selector Pill */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-sm shadow-sm">
                {fromToken === 'MBTTC' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px]">
                    ₿
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-[10px]">
                    ₮
                  </div>
                )}
                <span>{fromToken}</span>
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
              ≈ ${(payAmountNum * (fromToken === 'MBTTC' ? stats.price : 1)).toFixed(2)} USD
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

            {/* Target Token Pill */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-sm shadow-sm">
                {toToken === 'MBTTC' ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-[10px]">
                    ₿
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-[10px]">
                    ₮
                  </div>
                )}
                <span>{toToken}</span>
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
      <div className="relative z-10 mt-4 p-3.5 rounded-2xl bg-zinc-950/50 border border-zinc-800/70 space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span>Exchange Rate:</span>
          <span className="font-mono text-zinc-200">
            1 MBTTC = ${stats.price.toFixed(isLive ? 4 : 2)} USDT
          </span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Network & Settlement Fee:</span>
          <span className="font-mono text-emerald-400">0.00% (Protocol Subsidized)</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Execution Contract:</span>
          <span className="font-mono text-zinc-300">
            {isLive ? 'PancakeSwap V2 Router (BSC)' : 'Simulated AMM Engine (Demo)'}
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
    </div>
  );
};
