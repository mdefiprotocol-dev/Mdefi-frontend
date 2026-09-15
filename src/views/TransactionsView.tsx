import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, 
  Search, 
  Filter, 
  Check, 
  Copy, 
  ExternalLink,
  Coins,
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { ActivityItem } from '../types';
import { getTransactionVisual } from '../utils/transactionVisuals';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { ResponsivePagination } from '../components/common/ResponsivePagination';
import { groupActivitiesInPairs } from '../components/activity/CompactActivityRow';

interface TransactionsViewProps {
  activities: ActivityItem[];
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ activities }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6; // 6 data records per page (renders as 3 compact 2-in-1 pairs on mobile)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchQuery]);

  const handleCopy = async (hash: string) => {
    const ok = await copyFullAddress(hash);
    if (ok) {
      setCopiedHash(hash);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Type filter
      if (filterType !== 'All' && act.type !== filterType) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          act.type.toLowerCase().includes(q) ||
          act.txHash.toLowerCase().includes(q) ||
          act.amount.toLowerCase().includes(q) ||
          (act.details && act.details.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [activities, filterType, searchQuery]);

  // Current page records (preserving newest to oldest order)
  const pagedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredActivities.slice(startIndex, startIndex + pageSize);
  }, [filteredActivities, currentPage, pageSize]);

  // Group current page records in pairs for compact mobile containers
  const mobilePairs = useMemo(() => {
    return groupActivitiesInPairs(pagedActivities);
  }, [pagedActivities]);

  const activityTypes = ['All', 'Reward', 'Registration', 'Referral', 'Package', 'Staking', 'Income', 'Bonus'];

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
            Audit Trail
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
            Demo Ledger
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Transaction & Activity Ledger
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Immutable simulated smart contract calls, reward dispatches, package purchases, and referral distributions.
        </p>
      </div>

      {/* LEDGER CARD */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5">
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 min-w-0">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800 overflow-x-auto max-w-full min-w-0">
            {activityTypes.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  filterType === t 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64 min-w-0">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search type, hash, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 sm:py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Desktop Transaction Table (Unchanged layout for desktop/PC) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="pb-3 font-semibold pl-2">Date & Time</th>
                <th className="pb-3 font-semibold">Transaction Type</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Details</th>
                <th className="pb-3 font-semibold text-right pr-2">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {pagedActivities.map((act) => {
                const visual = getTransactionVisual(act.type, act.status, act.amount);
                const IconComp = visual.icon;
                const isCopied = copiedHash === act.txHash;
                return (
                  <tr key={act.id} className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Date */}
                    <td className="py-3.5 pl-2 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                      {act.date}
                    </td>
                    {/* Type with Icon & Dot */}
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${visual.dotClass}`} />
                        <div className={`p-1.5 rounded-lg border ${visual.iconBgClass} ${visual.iconTextClass}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-zinc-100">
                          {act.type}
                        </span>
                      </div>
                    </td>
                    {/* Amount */}
                    <td className="py-3.5 whitespace-nowrap font-mono font-bold">
                      <span className={visual.amountClass}>
                        {act.amount}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                        <span className={`w-1.5 h-1.5 rounded-full ${visual.dotClass}`} />
                        {act.status} (Demo)
                      </span>
                    </td>
                    {/* Details */}
                    <td className="py-3.5 text-zinc-400 text-xs">
                      {act.details || 'Smart contract internal execution'}
                    </td>
                    {/* Tx Hash */}
                    <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="font-mono text-[11px] text-zinc-400 group-hover:text-emerald-300 transition-colors truncate max-w-[160px] xl:max-w-none" title={act.txHash}>
                          {formatCompactAddress(act.txHash)}
                        </span>
                        <button
                          onClick={() => handleCopy(act.txHash)}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy Full Transaction Hash"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive 2-in-1 Compact Cards */}
        <div className="md:hidden space-y-3">
          {pagedActivities.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              No transactions found matching your filters.
            </div>
          ) : (
            mobilePairs.map((pair, pIdx) => (
              <div 
                key={`mobile-pair-${pair[0]?.id || pIdx}`}
                className="rounded-2xl bg-zinc-950/85 border border-emerald-500/20 divide-y divide-zinc-850/80 overflow-hidden font-mono shadow-[0_0_15px_rgba(0,0,0,0.4)]"
              >
                {pair.map((act) => {
                  const visual = getTransactionVisual(act.type, act.status, act.amount);
                  const IconComp = visual.icon;
                  const isCopied = copiedHash === act.txHash;

                  return (
                    <div key={act.id} className="p-3 sm:p-3.5 space-y-2 hover:bg-zinc-900/30 transition-colors">
                      {/* Row 1: Icon + Type (Left) & Amount (Right) */}
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`p-1.5 rounded-lg border ${visual.iconBgClass} ${visual.iconTextClass} shrink-0`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs text-white truncate">
                            {act.type}
                          </span>
                        </div>

                        <span className={`text-xs font-extrabold shrink-0 text-right ${visual.amountClass}`}>
                          {act.amount}
                        </span>
                      </div>

                      {/* Row 2: Blockchain Hash + Copy Button */}
                      <div className="flex items-center justify-between gap-2 py-1 px-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-[11px] min-w-0">
                        <span className="text-zinc-400 truncate min-w-0" title={act.txHash}>
                          {formatCompactAddress(act.txHash)}
                        </span>
                        <button
                          onClick={() => handleCopy(act.txHash)}
                          className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Copy Full Hash"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Optional Details */}
                      {act.details && (
                        <p className="text-[11px] text-zinc-400/90 leading-relaxed break-words px-0.5">
                          {act.details}
                        </p>
                      )}

                      {/* Row 3: Status (Left) & Date/Time (Right) */}
                      <div className="pt-1.5 border-t border-zinc-900/90 flex items-center justify-between gap-2 text-[10px] min-w-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border shrink-0 ${
                          act.status === 'Confirmed'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30'
                            : act.status === 'Pending'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-500/30'
                            : 'bg-rose-950/70 text-rose-300 border-rose-500/30'
                        }`}>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="font-bold">{act.status}</span>
                        </span>

                        <span className="text-zinc-400 font-medium truncate shrink-0">{act.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Universal Pagination */}
        {filteredActivities.length > pageSize && (
          <div className="pt-2 border-t border-zinc-850">
            <ResponsivePagination
              currentPage={currentPage}
              totalItems={filteredActivities.length}
              pageSize={pageSize}
              onPageChange={(p) => setCurrentPage(p)}
              showItemCount
            />
          </div>
        )}

        {/* Table footer */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-400 font-mono">
          <span>Showing {pagedActivities.length} of {filteredActivities.length} filtered ledger events ({activities.length} total)</span>
          <span className="text-emerald-400">Status: In Sync with Demo Ledger</span>
        </div>
      </div>
    </div>
  );
};
