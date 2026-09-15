import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Check, 
  Copy, 
  RotateCcw, 
  Coins, 
  Award, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Clock,
  Search,
  X
} from 'lucide-react';
import { S4TransactionRecord, S4TransactionType } from '../types/s4Matrix';
import { transactionTypeColors, placementColors } from '../data/s4MatrixData';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { ResponsivePagination } from './common/ResponsivePagination';
import { groupActivitiesInPairs } from './activity/CompactActivityRow';

interface S4TransactionHistoryProps {
  transactions: S4TransactionRecord[];
  packageName: string;
}

export const S4TransactionHistory: React.FC<S4TransactionHistoryProps> = ({ 
  transactions,
  packageName,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  React.useEffect(() => {
    setPage(1);
  }, [filterType, searchQuery]);

  const handleCopy = async (hash: string, id: string) => {
    const ok = await copyFullAddress(hash);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getTransactionIcon = (type: S4TransactionType) => {
    switch (type) {
      case 'Package Activation':
        return ShieldCheck;
      case 'Direct Income':
        return ArrowDownLeft;
      case 'Matrix Income':
        return Layers;
      case 'Spillover':
        return Sparkles;
      case 'Recycle':
        return RotateCcw;
      case 'Re-entry':
        return RotateCcw;
      case 'Claim':
        return Coins;
      case 'Reward':
        return Award;
      default:
        return ArrowLeftRight;
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filterType !== 'All' && t.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesHash = t.txHash?.toLowerCase().includes(q);
      const matchesType = t.type?.toLowerCase().includes(q);
      const matchesDetails = t.details?.toLowerCase().includes(q);
      const matchesMatrix = t.matrix?.toLowerCase().includes(q);
      const matchesPosition = t.position?.toLowerCase().includes(q);
      if (!matchesHash && !matchesType && !matchesDetails && !matchesMatrix && !matchesPosition) {
        return false;
      }
    }
    return true;
  });

  const pagedTransactions = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const mobileTxPairs = React.useMemo(() => {
    return groupActivitiesInPairs(pagedTransactions);
  }, [pagedTransactions]);

  const availableTypes: S4TransactionType[] = [
    'Package Activation',
    'Direct Income',
    'Matrix Income',
    'Spillover',
    'Recycle',
    'Re-entry',
    'Claim',
    'Reward',
  ];

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#08150e] via-[#06100b] to-[#040806] border border-emerald-500/25 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.06)]">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-850">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-400">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Complete Package Transaction History
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold">
              {packageName}
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Immutable protocol records for package activations, matrix yields, spillover, and re-entries.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tx hash or type..."
              className="w-full sm:w-56 pl-8 pr-7 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 font-mono transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-mono">
            <button
              onClick={() => setFilterType('All')}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                filterType === 'All'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              All ({transactions.length})
            </button>
            {availableTypes.map((t) => {
              const count = transactions.filter((tx) => tx.type === t).length;
              if (count === 0) return null;
              const style = transactionTypeColors[t];
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    filterType === t
                      ? `${style.badgeBg} ${style.badgeText} border ${style.badgeBorder} font-bold shadow-md`
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor}`} />
                  <span>{t} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-zinc-400 font-mono border-b border-zinc-800/80">
              <th className="pb-3 font-semibold pl-2">Date & Time</th>
              <th className="pb-3 font-semibold">Transaction Type</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Matrix</th>
              <th className="pb-3 font-semibold">Level</th>
              <th className="pb-3 font-semibold">Position</th>
              <th className="pb-3 font-semibold">Placement Type</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold text-right pr-2">Tx Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-mono">
            {pagedTransactions.map((tx) => {
              const typeCfg = transactionTypeColors[tx.type];
              const placementCfg = placementColors[tx.placementType];
              const IconComp = getTransactionIcon(tx.type);
              const isCopied = copiedId === tx.id;
              return (
                <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors group">
                  {/* Date & Time */}
                  <td className="py-3.5 pl-2 text-zinc-300 whitespace-nowrap">
                    {tx.dateTime}
                  </td>
                  {/* Transaction Type with Color Indicator & Icon */}
                  <td className="py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${typeCfg.badgeBg} ${typeCfg.badgeBorder} ${typeCfg.iconColor}`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold ${typeCfg.badgeBg} ${typeCfg.badgeBorder} ${typeCfg.badgeText}`}>
                        {tx.type}
                      </span>
                    </div>
                  </td>
                  {/* Amount */}
                  <td className="py-3.5 font-bold text-white whitespace-nowrap">
                    <span className={tx.amount.startsWith('-') ? 'text-rose-400' : 'text-emerald-400'}>
                      {tx.amount}
                    </span>
                  </td>
                  {/* Matrix */}
                  <td className="py-3.5 text-zinc-300 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                      {tx.matrix}
                    </span>
                  </td>
                  {/* Level */}
                  <td className="py-3.5 text-zinc-400 whitespace-nowrap">
                    {tx.level}
                  </td>
                  {/* Position */}
                  <td className="py-3.5 text-zinc-300 whitespace-nowrap font-medium">
                    {tx.position}
                  </td>
                  {/* Placement Type Indicator */}
                  <td className="py-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-medium ${placementCfg.badgeBg} ${placementCfg.badgeBorder} ${placementCfg.badgeText}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${placementCfg.dotColor}`} />
                      {placementCfg.label}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border bg-emerald-950/80 border-emerald-500/30 text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                      {tx.status} (Demo)
                    </span>
                  </td>
                  {/* Tx Hash with Copy */}
                  <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="text-zinc-400 font-mono text-[11px] group-hover:text-emerald-300 transition-colors" title={tx.txHash}>
                        {formatCompactAddress(tx.txHash)}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.txHash, tx.id)}
                        className="p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Copy Full Tx Hash"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Compact Transaction Cards (<768px per Section 4) with 2-in-1 Density */}
      <div className="md:hidden space-y-3 mt-4 font-mono">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No transactions found matching your filter criteria.
          </div>
        ) : (
          mobileTxPairs.map((pair, pIdx) => (
            <div
              key={`s4-pair-${pair[0]?.id || pIdx}`}
              className="rounded-2xl bg-zinc-950/85 border border-emerald-500/20 divide-y divide-zinc-850/80 overflow-hidden shadow-sm"
            >
              {pair.map((tx) => {
                const typeCfg = transactionTypeColors[tx.type];
                const placementCfg = placementColors[tx.placementType];
                const IconComp = getTransactionIcon(tx.type);
                const isCopied = copiedId === tx.id;
                return (
                  <div 
                    key={tx.id} 
                    className="p-3.5 space-y-2.5 hover:bg-zinc-900/30 transition-all"
                  >
                    {/* Row 1: Icon + Type Badge (Left) & Amount (Right) */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className={`p-1.5 rounded-lg border ${typeCfg.badgeBg} ${typeCfg.badgeBorder} ${typeCfg.iconColor} shrink-0`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold truncate ${typeCfg.badgeBg} ${typeCfg.badgeBorder} ${typeCfg.badgeText}`}>
                          {tx.type}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-extrabold text-emerald-400">
                          {tx.amount}
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Hash + Copy Button */}
                    <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] min-w-0">
                      <span className="text-zinc-400 truncate min-w-0" title={tx.txHash}>
                        {formatCompactAddress(tx.txHash)}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.txHash, tx.id)}
                        className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy Full Hash"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Optional Placement / Matrix location */}
                    <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400 px-0.5 min-w-0">
                      <span className="text-zinc-300 font-medium truncate min-w-0">
                        {tx.level} — {tx.position} ({tx.matrix})
                      </span>
                      <span className={`inline-flex items-center gap-1 ${placementCfg.textColor} shrink-0`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${placementCfg.dotColor}`} />
                        {placementCfg.label}
                      </span>
                    </div>

                    {/* Row 3: Status (Left) & Date/Time (Right) */}
                    <div className="pt-1.5 border-t border-zinc-900/90 flex items-center justify-between gap-2 text-[10px] min-w-0">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                        <span>{tx.status}</span>
                      </span>

                      <span className="text-zinc-400 font-medium truncate shrink-0">{tx.dateTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Universal Pagination */}
      {filteredTransactions.length > pageSize && (
        <div className="mt-4 pt-3 border-t border-zinc-850">
          <ResponsivePagination
            currentPage={page}
            totalItems={filteredTransactions.length}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            showItemCount
          />
        </div>
      )}
    </div>
  );
};
