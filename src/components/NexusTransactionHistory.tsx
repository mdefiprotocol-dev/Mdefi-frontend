import React, { useState } from 'react';
import { 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { NexusTransactionRecord, NexusTransactionCategory } from '../types/nexusMatrix';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { ResponsivePagination } from './common/ResponsivePagination';
import { groupActivitiesInPairs } from './activity/CompactActivityRow';

interface NexusTransactionHistoryProps {
  transactions: NexusTransactionRecord[];
  packageName: string;
}

export const NexusTransactionHistory: React.FC<NexusTransactionHistoryProps> = ({
  transactions,
  packageName,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 4;

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, categoryFilter]);

  const handleCopy = async (text: string) => {
    const ok = await copyFullAddress(text);
    if (ok) {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const getCategoryBadge = (type: NexusTransactionCategory) => {
    switch (type) {
      case 'Package Activation':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/40',
          text: 'text-emerald-300',
          icon: Zap,
        };
      case 'Direct Placement':
        return {
          bg: 'bg-emerald-900/60',
          border: 'border-emerald-400/40',
          text: 'text-emerald-300',
          icon: ShieldCheck,
        };
      case 'Spillover':
        return {
          bg: 'bg-pink-950/80',
          border: 'border-pink-500/40',
          text: 'text-pink-300',
          icon: Sparkles,
        };
      case 'Recycle':
      case 'Re-entry':
        return {
          bg: 'bg-rose-950/80',
          border: 'border-rose-500/40',
          text: 'text-rose-300',
          icon: RotateCcw,
        };
      case 'Matrix Income':
      case 'Cycle Reward':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          icon: TrendingUp,
        };
      case 'Matrix Placement':
      default:
        return {
          bg: 'bg-zinc-900',
          border: 'border-zinc-700',
          text: 'text-zinc-300',
          icon: Layers,
        };
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.member.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tx.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pagedTransactions = React.useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const mobileTxPairs = React.useMemo(() => {
    return groupActivitiesInPairs(pagedTransactions);
  }, [pagedTransactions]);

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#09100c]/90 via-[#060907]/95 to-[#040605] border border-emerald-500/20 p-4 sm:p-6 lg:p-8 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-emerald-500/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
              Contract Event Stream
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {packageName} Scope Only
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white font-mono flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span className="uppercase">{packageName} Transaction History</span>
            <span className="text-xs font-mono font-normal text-zinc-400">
              ({filteredTransactions.length} Recorded)
            </span>
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search member, slot, hash..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="all">All Event Types</option>
              <option value="Package Activation">Package Activation</option>
              <option value="Direct Placement">Direct Placement</option>
              <option value="Spillover">Spillover</option>
              <option value="Recycle">Recycle</option>
              <option value="Matrix Income">Matrix Income</option>
              <option value="Matrix Placement">Matrix Placement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Transaction Table (Unchanged for md+ screens) */}
      <div className="mt-5 hidden md:block overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-800/80 text-zinc-400 text-[11px] uppercase tracking-wider">
              <th className="pb-3 font-semibold">Date / Time</th>
              <th className="pb-3 font-semibold">Event Type</th>
              <th className="pb-3 font-semibold">Position / Ring</th>
              <th className="pb-3 font-semibold">Member / Wallet</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Tx Hash / Proof</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {pagedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-zinc-500">
                  No transaction records found matching your filters.
                </td>
              </tr>
            ) : (
              pagedTransactions.map((tx) => {
                const badge = getCategoryBadge(tx.type);
                const Icon = badge.icon;
                const isPositive = tx.amount.startsWith('+');

                return (
                  <tr 
                    key={tx.id}
                    className="hover:bg-zinc-900/30 transition-colors group"
                  >
                    {/* Date / Time */}
                    <td className="py-3.5 pr-3 text-zinc-300 whitespace-nowrap">
                      {tx.dateTime}
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${badge.bg} ${badge.border} ${badge.text}`}>
                        <Icon className="w-3 h-3" />
                        <span>{tx.type}</span>
                      </span>
                    </td>

                    {/* Position */}
                    <td className="py-3.5 pr-3 text-zinc-200 font-bold whitespace-nowrap">
                      {tx.position}
                    </td>

                    {/* Member / Wallet */}
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <div className="text-white font-medium">
                        {tx.member}
                      </div>
                      {tx.memberWallet && (
                        <div className="text-[10px] text-zinc-400">
                          {formatCompactAddress(tx.memberWallet)}
                        </div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className={`font-bold ${
                        isPositive 
                          ? 'text-emerald-400' 
                          : tx.amount.includes('Auto') 
                          ? 'text-rose-400' 
                          : 'text-white'
                      }`}>
                        {tx.amount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>

                    {/* Tx Hash */}
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 font-mono text-[11px]">
                          {formatCompactAddress(tx.txHash)}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.txHash)}
                          className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                          title="Copy Full Transaction Hash"
                        >
                          {copiedHash === tx.txHash ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Compact Transaction Cards (<768px per Section 4) with 2-in-1 Density */}
      <div className="mt-4 md:hidden space-y-3 font-mono">
        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No transaction records found matching your filters.
          </div>
        ) : (
          mobileTxPairs.map((pair, pIdx) => (
            <div
              key={`nexus-pair-${pair[0]?.id || pIdx}`}
              className="rounded-2xl bg-zinc-950/85 border border-emerald-500/20 divide-y divide-zinc-850/80 overflow-hidden shadow-sm"
            >
              {pair.map((tx) => {
                const badge = getCategoryBadge(tx.type);
                const Icon = badge.icon;
                const isPositive = tx.amount.startsWith('+');
                const isCopied = copiedHash === tx.txHash;

                return (
                  <div
                    key={tx.id}
                    className="p-3.5 space-y-2.5 hover:bg-zinc-900/30 transition-all"
                  >
                    {/* Row 1: Icon + Type Badge (Left) & Amount (Right) */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${badge.bg} ${badge.border} ${badge.text} shrink-0`}>
                          <Icon className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[140px] sm:max-w-none">{tx.type}</span>
                        </span>
                      </div>

                      <span className={`text-xs font-extrabold shrink-0 text-right ${
                        isPositive 
                          ? 'text-emerald-400' 
                          : tx.amount.includes('Auto') 
                          ? 'text-rose-400' 
                          : 'text-white'
                      }`}>
                        {tx.amount}
                      </span>
                    </div>

                    {/* Row 2: Hash + Copy Button */}
                    <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] min-w-0">
                      <span className="text-zinc-400 truncate min-w-0" title={tx.txHash}>
                        {formatCompactAddress(tx.txHash)}
                      </span>
                      <button
                        onClick={() => handleCopy(tx.txHash)}
                        className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy Full Hash"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Optional Metadata: Position & Member */}
                    {(tx.position || tx.member) && (
                      <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-400 px-0.5 min-w-0">
                        <span className="text-zinc-300 font-medium truncate min-w-0">
                          {tx.position}
                        </span>
                        <span className="text-zinc-500 truncate min-w-0">
                          {tx.member} {tx.memberWallet ? `(${formatCompactAddress(tx.memberWallet)})` : ''}
                        </span>
                      </div>
                    )}

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

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono text-zinc-500 flex-wrap gap-2">
        <span>Verified contract event telemetry strictly isolated to {packageName}</span>
        <span>Standard Web3 Read • Phase 1 Sandbox Verified</span>
      </div>
    </div>
  );
};
