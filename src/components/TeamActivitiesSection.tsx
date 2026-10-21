import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Check, 
  Copy, 
  Layers, 
  Sparkles, 
  UserPlus, 
  Cpu, 
  TrendingUp, 
  Network, 
  Zap, 
  Award, 
  Crown, 
  Briefcase, 
  Search 
} from 'lucide-react';
import { TeamTransactionRecord } from '../types';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { ResponsivePagination } from './common/ResponsivePagination';
import { Rotating3DMbttcCoin } from './common/Rotating3DMbttcCoin';

interface TeamActivitiesSectionProps {
  transactions: TeamTransactionRecord[];
}

export const TeamActivitiesSection: React.FC<TeamActivitiesSectionProps> = ({ transactions }) => {
  const [txFilter, setTxFilter] = useState<string>('All');
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [txPage, setTxPage] = useState<number>(1);
  const txPageSize = 15;

  const handleCopy = async (hashOrAddress: string) => {
    const ok = await copyFullAddress(hashOrAddress);
    if (ok) {
      setCopiedHash(hashOrAddress);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const txFilterTabs = [
    { label: 'All', icon: Layers, color: 'text-zinc-400', activeGlow: 'from-zinc-800 to-zinc-900 border-zinc-600' },
    { label: 'Register User', icon: UserPlus, color: 'text-cyan-400', activeGlow: 'from-cyan-950/80 to-zinc-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' },
    { label: 'MBTTC MINTS', icon: Sparkles, color: 'text-amber-400', activeGlow: 'from-amber-950/80 to-zinc-900 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },    { label: 'ACTIVATE NODES', icon: Cpu, color: 'text-emerald-400', activeGlow: 'from-emerald-950/80 to-zinc-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' },
    { label: 'DIRECT INCOME', icon: TrendingUp, color: 'text-lime-400', activeGlow: 'from-lime-950/80 to-zinc-900 border-lime-500/50 shadow-[0_0_15px_rgba(132,204,22,0.3)]' },
    { label: 'MATRIX INCOME', icon: Network, color: 'text-purple-400', activeGlow: 'from-purple-950/80 to-zinc-900 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' },
    { label: 'MAGIC CASHBACK', icon: Zap, color: 'text-rose-400', activeGlow: 'from-rose-950/80 to-zinc-900 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]' },
    { label: 'WEEKLY REWARD 1', icon: Award, color: 'text-sky-400', activeGlow: 'from-sky-950/80 to-zinc-900 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)]' },
    { label: 'WEEKLY REWARD 2', icon: Crown, color: 'text-yellow-300', activeGlow: 'from-yellow-950/80 to-zinc-900 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' },
    { label: 'WEEKLY SALARY', icon: Briefcase, color: 'text-emerald-300', activeGlow: 'from-emerald-950/80 to-zinc-900 border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.3)]' },
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (txFilter !== 'All') {
        const type = (tx.activityType || '').toLowerCase();
        const details = (tx.details || '').toLowerCase();
        const pkg = (tx.packageName || '').toLowerCase();
        const combined = `${type} ${details} ${pkg}`;

        switch (txFilter) {
          case 'Register User':
            if (!combined.includes('register') && !combined.includes('registration')) return false;
            break;
          case 'MBTTC MINTS':
            if (!combined.includes('mint') && !combined.includes('claim')) return false;
            break;
          case 'ACTIVATE NODES':
            if (!combined.includes('package') && !combined.includes('activate') && !combined.includes('node')) return false;
            break;
          case 'DIRECT INCOME':
            if (!combined.includes('direct') && !combined.includes('referral')) return false;
            break;
          case 'MATRIX INCOME':
            if (!combined.includes('matrix')) return false;
            break;
          case 'MAGIC CASHBACK':
            if (!combined.includes('cashback') && !combined.includes('magic')) return false;
            break;
          case 'WEEKLY REWARD 1':
            if (!combined.includes('reward') && !combined.includes('weekly 1')) return false;
            break;
          case 'WEEKLY REWARD 2':
            if (!combined.includes('premium reward') && !combined.includes('weekly 2')) return false;
            break;
          case 'WEEKLY SALARY':
            if (!combined.includes('salary') && !combined.includes('passive')) return false;
            break;
          default:
            if (!combined.includes(txFilter.toLowerCase())) return false;
        }
      }

      if (txSearchQuery.trim()) {
        const q = txSearchQuery.toLowerCase();
        const matchesType = (tx.activityType || '').toLowerCase().includes(q);
        const matchesWallet = (tx.memberWallet || '').toLowerCase().includes(q);
        const matchesUserId = tx.userId ? tx.userId.toLowerCase().includes(q) : false;
        const matchesAmount = tx.amount ? tx.amount.toLowerCase().includes(q) : false;
        const matchesPackage = tx.packageName ? tx.packageName.toLowerCase().includes(q) : false;
        const matchesDetails = tx.details ? tx.details.toLowerCase().includes(q) : false;
        const matchesHash = tx.txHash ? tx.txHash.toLowerCase().includes(q) : false;

        return matchesType || matchesWallet || matchesUserId || matchesAmount || matchesPackage || matchesDetails || matchesHash;
      }

      return true;
    });
  }, [transactions, txFilter, txSearchQuery]);

  const pagedTransactions = useMemo(() => {
    const startIndex = (txPage - 1) * txPageSize;
    return filteredTransactions.slice(startIndex, startIndex + txPageSize);
  }, [filteredTransactions, txPage, txPageSize]);

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              TEAM ACTIVITIES
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Activity across your team
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>● LIVE TEAM ACTIVITY</span>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-950/90 border border-emerald-500/20 overflow-x-auto scrollbar-none max-w-full backdrop-blur-md">
          {txFilterTabs.map(({ label, icon: TabIcon, color, activeGlow }) => {
            const isActive = txFilter === label;
            return (
              <button
                key={label}
                type="button"
                onClick={() => { setTxFilter(label); setTxPage(1); }}
                className={`group relative px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? `bg-gradient-to-r ${activeGlow} text-white scale-[1.02]`
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-850 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {label === 'MBTTC MINTS' ? (
                  <Rotating3DMbttcCoin size={15} accent="amber" />
                ) : (
                  <TabIcon
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                      isActive
                        ? `${color} animate-pulse drop-shadow-[0_0_8px_currentColor]`
                        : `${color} opacity-70 group-hover:opacity-100 group-hover:scale-110`
                    }`}
                  />
                )}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search type, wallet, hash..."
            value={txSearchQuery}
            onChange={(e) => { setTxSearchQuery(e.target.value); setTxPage(1); }}
            className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 font-mono"
          />
        </div>
      </div>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <table className="w-full text-left text-xs min-w-[900px] border-collapse font-mono">
          <thead>
            <tr className="border-b border-zinc-800/80 text-zinc-400 uppercase tracking-wider text-[11px]">
              <th className="pb-3.5 pl-3 font-semibold w-[120px]">Member ID</th>
              <th className="pb-3.5 font-semibold w-[130px]">Sponsor</th>
              <th className="pb-3.5 font-semibold w-[170px]">User Address</th>
              <th className="pb-3.5 font-semibold">Activity Type & Details</th>
              <th className="pb-3.5 font-semibold w-[160px]">Date & Time</th>
              <th className="pb-3.5 font-semibold w-[110px]">Status</th>
              <th className="pb-3.5 font-semibold text-right pr-3 w-[140px]">Tx Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-850/60">
            {pagedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-500 text-xs bg-zinc-950/20 rounded-2xl">
                  <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                  No on-chain team activities found for this category.
                </td>
              </tr>
            ) : (
              pagedTransactions.map((tx) => {
                const act = (tx.activityType || '').toLowerCase();
                const det = (tx.details || '').toLowerCase();
                const pkg = (tx.packageName || '').toLowerCase();
                const isWalletCopied = copiedHash === tx.memberWallet;
                const isHashCopied = copiedHash === tx.txHash;

                // Dynamic Member ID & Sponsor Resolution
                const rawMemberId = tx.userId || (tx.memberWallet ? `MDF-${tx.memberWallet.slice(2, 8).toUpperCase()}` : 'MDF-User');
                const sponsorDisplay = (tx as any).sponsorId || (tx as any).sponsor || 'MDF-248161';

                // Category & Situation Based Cyber Icons + Titles
                let IconComp = Layers;
                let iconBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';
                let activityTitle = tx.activityType || 'Protocol Activity';
                let subDetail = tx.details || 'On-chain verified event';

                if (act.includes('register') || det.includes('register')) {
                  IconComp = UserPlus;
                  iconBg = 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
                  activityTitle = 'Register User';
                  subDetail = 'Direct partner registered on-chain';
                } else if (act.includes('mint') || act.includes('claim') || det.includes('yield') || det.includes('claim')) {
                  IconComp = Sparkles;
                  iconBg = 'bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]';
                  activityTitle = act.includes('pool') || det.includes('referral')
                    ? 'Total Referral Claim'
                    : 'Package Claim';
                  subDetail = tx.packageName || 'Yield reward claimed to wallet';
                } else if (act.includes('package') || act.includes('node') || pkg.includes('pool') || pkg.includes('10')) {
                  IconComp = Cpu;
                  iconBg = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]';
                  activityTitle = 'Node Activation';
                  subDetail = tx.packageName || 'Starter Pool Node Active';
                } else if (act.includes('direct') || det.includes('referral reward')) {
                  IconComp = TrendingUp;
                  iconBg = 'bg-lime-950/80 text-lime-400 border-lime-500/40 shadow-[0_0_12px_rgba(132,204,22,0.25)]';
                  activityTitle = 'Direct Income';
                  subDetail = 'Direct frontline sponsor commission';
                } else if (act.includes('matrix')) {
                  IconComp = Network;
                  iconBg = 'bg-purple-950/80 text-purple-400 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]';
                  activityTitle = 'Matrix Income';
                  subDetail = 'Global matrix node yield distribution';
                } else if (act.includes('cashback') || act.includes('magic')) {
                  IconComp = Zap;
                  iconBg = 'bg-rose-950/80 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)]';
                  activityTitle = 'Magic Cashback';
                  subDetail = 'Daily volume magic cashback';
                } else if (act.includes('reward 1') || act.includes('weekly 1')) {
                  IconComp = Award;
                  iconBg = 'bg-sky-950/80 text-sky-400 border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.25)]';
                  activityTitle = 'Weekly Reward 1';
                  subDetail = 'Tier performance community bonus';
                } else if (act.includes('reward 2') || act.includes('weekly 2')) {
                  IconComp = Crown;
                  iconBg = 'bg-yellow-950/80 text-yellow-300 border-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.25)]';
                  activityTitle = 'Weekly Reward 2';
                  subDetail = 'Elite tier leadership incentive';
                } else if (act.includes('salary') || det.includes('passive')) {
                  IconComp = Briefcase;
                  iconBg = 'bg-teal-950/80 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.25)]';
                  activityTitle = 'Weekly Salary';
                  subDetail = 'Weekly executive passive salary';
                }

                return (
                  <tr key={tx.id} className="hover:bg-zinc-850/40 transition-colors group">
                    {/* 1. Member ID */}
                    <td className="py-4 pl-3 whitespace-nowrap">
                      <span className="text-emerald-400 font-bold text-xs">
                        {rawMemberId}
                      </span>
                    </td>

                    {/* 2. Sponsor (ID Number) */}
                    <td className="py-4 whitespace-nowrap">
                      <span className="text-zinc-300 text-xs">
                        {sponsorDisplay}
                      </span>
                    </td>

                    {/* 3. User Address */}
                    <td className="py-4 pr-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-400 text-[11px]">
                          {formatCompactAddress(tx.memberWallet)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(tx.memberWallet)}
                          className="p-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                          title="Copy Wallet Address"
                        >
                          {isWalletCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* 4. Activity Type & Dynamic Details + Context Icon */}
                    <td className="py-4 pr-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1 rounded-xl border shrink-0 flex items-center justify-center ${iconBg}`}>
                        {act.includes('mint') || act.includes('claim') || det.includes('yield') ? (
                          <Rotating3DMbttcCoin size={26} accent="amber" />
                        ) : (
                          <IconComp className="w-3.5 h-3.5" />
                        )}
                      </div><div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-zinc-100 text-xs">
                              {activityTitle}
                            </span>
                            {tx.amount && (
                              <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                {tx.amount}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-zinc-400 block truncate mt-0.5">
                            {subDetail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 5. Date & Time */}
                    <td className="py-4 pr-3 text-zinc-400 text-[11px] whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span>{tx.date}</span>
                      </span>
                    </td>

                    {/* 6. Status with Confirmed Icon */}
                    <td className="py-4 pr-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{tx.status || 'Confirmed'}</span>
                      </span>
                    </td>

                    {/* 7. Tx Hash */}
                    <td className="py-4 pr-3 text-right whitespace-nowrap">
                      {tx.txHash ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-[11px] text-zinc-400 group-hover:text-emerald-300 transition-colors" title={tx.txHash}>
                            {formatCompactAddress(tx.txHash)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.txHash!)}
                            className="p-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Copy Transaction Hash"
                          >
                            {isHashCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Feed (7-Point Structured) */}
      <div className="md:hidden space-y-3 font-mono">
        {pagedTransactions.length === 0 ? (
          <div className="py-10 text-center text-zinc-500 text-xs bg-zinc-950/40 rounded-2xl border border-zinc-800/60">
            No on-chain team activities found for this category.
          </div>
        ) : (
          pagedTransactions.map((tx) => {
            const act = (tx.activityType || '').toLowerCase();
            const det = (tx.details || '').toLowerCase();
            const pkg = (tx.packageName || '').toLowerCase();
            const isWalletCopied = copiedHash === tx.memberWallet;
            const isHashCopied = copiedHash === tx.txHash;

            const rawMemberId = tx.userId || (tx.memberWallet ? `MDF-${tx.memberWallet.slice(2, 8).toUpperCase()}` : 'MDF-User');
            const sponsorDisplay = (tx as any).sponsorId || (tx as any).sponsor || 'MDF-248161';

            let IconComp = Layers;
            let iconBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';
            let activityTitle = tx.activityType || 'Activity';

            if (act.includes('register') || det.includes('register')) {
              IconComp = UserPlus;
              iconBg = 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40';
              activityTitle = tx.amount ? `Register User (${tx.amount})` : 'Register User';
            } else if (act.includes('mint') || act.includes('claim')) {
              IconComp = Sparkles;
              iconBg = 'bg-amber-950/80 text-amber-400 border-amber-500/40';
              activityTitle = act.includes('pool') ? `Referral Claim (${tx.amount || '0 MBTTC'})` : `Package Claim (${tx.amount || '0 MBTTC'})`;
            } else if (act.includes('package') || act.includes('node') || pkg.includes('pool')) {
              IconComp = Cpu;
              iconBg = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
              activityTitle = `Node Activation (${tx.amount || '$10'})`;
            } else if (act.includes('direct')) {
              IconComp = TrendingUp;
              iconBg = 'bg-lime-950/80 text-lime-400 border-lime-500/40';
              activityTitle = `Direct Income (${tx.amount || '0 MBTTC'})`;
            } else if (act.includes('matrix')) {
              IconComp = Network;
              iconBg = 'bg-purple-950/80 text-purple-400 border-purple-500/40';
              activityTitle = `Matrix Income (${tx.amount || '0 MBTTC'})`;
            } else if (act.includes('cashback')) {
              IconComp = Zap;
              iconBg = 'bg-rose-950/80 text-rose-400 border-rose-500/40';
              activityTitle = `Magic Cashback (${tx.amount || '0 MBTTC'})`;
            } else if (act.includes('salary')) {
              IconComp = Briefcase;
              iconBg = 'bg-teal-950/80 text-teal-300 border-teal-500/40';
              activityTitle = `Weekly Salary (${tx.amount || '0 MBTTC'})`;
            }

            return (
              <div key={tx.id} className="p-4 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 backdrop-blur-md space-y-3">
                {/* 1. Member ID & 2. Sponsor */}
                <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500 text-[10px]">ID:</span>
                    <span className="text-emerald-400 font-bold">{rawMemberId}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-zinc-500 text-[10px]">Sponsor:</span>
                    <span className="text-zinc-300">{sponsorDisplay}</span>
                  </div>
                </div>

                {/* 4. Activity Type with Icon & Light Green Amount Highlight */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1 rounded-xl border shrink-0 flex items-center justify-center ${iconBg}`}>
                      {act.includes('mint') || act.includes('claim') || det.includes('yield') ? (
                        <Rotating3DMbttcCoin size={22} accent="amber" />
                      ) : (
                        <IconComp className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white block truncate">{activityTitle}</span>
                      <span className="text-[10px] text-zinc-400 block truncate">{tx.details || 'On-chain event'}</span>
                    </div>
                  </div>
                  {tx.amount && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 shrink-0">
                      {tx.amount}
                    </span>
                  )}
                </div>

                {/* 3. Address & 5. Date */}
                <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-850/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">{formatCompactAddress(tx.memberWallet)}</span>
                    <button type="button" onClick={() => handleCopy(tx.memberWallet)} className="p-1 text-zinc-400 hover:text-emerald-400">
                      {isWalletCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-[10px] text-zinc-500">{tx.date}</span>
                </div>

                {/* 6. Status & 7. Tx Hash */}
                <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{tx.status || 'Confirmed'}</span>
                  </span>

                  {tx.txHash ? (
                    <div className="flex items-center gap-1">
                      <span>{formatCompactAddress(tx.txHash)}</span>
                      <button type="button" onClick={() => handleCopy(tx.txHash!)} className="p-1 text-zinc-400 hover:text-emerald-400">
                        {isHashCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination & Footer */}
      {filteredTransactions.length > txPageSize && (
        <div className="pt-2 border-t border-zinc-850">
          <ResponsivePagination
            currentPage={txPage}
            totalItems={filteredTransactions.length}
            pageSize={txPageSize}
            onPageChange={(p) => setTxPage(p)}
            showItemCount
          />
        </div>
      )}

      <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400 font-mono">
        <span>Showing {pagedTransactions.length} of {filteredTransactions.length} filtered activities</span>
        <span className="text-emerald-400">● Real Web3 Mode Active</span>
      </div>
    </div>
  );
};