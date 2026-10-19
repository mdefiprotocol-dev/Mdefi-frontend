import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Network, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Clock, 
  Check, 
  Copy, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  ArrowRight, 
  UserPlus, 
  Box, 
  X, 
  User as UserIcon 
} from 'lucide-react';
import { TeamMember, UserProfile, TeamTransactionRecord } from '../types';
import { mdefiService } from '../services/mdefiService';
import { centralEventSyncService } from '../services/centralEventSyncService';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { getTransactionVisual } from '../utils/transactionVisuals';
import { ResponsivePagination } from '../components/common/ResponsivePagination';
import { groupActivitiesInPairs } from '../components/activity/CompactActivityRow';
import { ExploreUser } from '../components/ExploreUser';
import { ethers } from 'ethers';
import { getTeamLevelOnChain } from '../services/teamLevelService';

interface TeamViewProps {
  user: UserProfile;
  members: TeamMember[];
  onOpenMatrixModal: () => void;
  transactions?: TeamTransactionRecord[];
}

export const TeamView: React.FC<TeamViewProps> = ({
  user,
  members,
  onOpenMatrixModal,
  transactions: initialTransactions,
}) => {
  const [txState, setTxState] = useState<{ isRealData: boolean; transactions: TeamTransactionRecord[] }>({
    isRealData: false,
    transactions: initialTransactions || [],
  });
  const [syncedMembers, setSyncedMembers] = useState<TeamMember[]>(
    () => centralEventSyncService.getState().teamMembers || []
  );
  const [txFilter, setTxFilter] = useState<string>('All');
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const cleanWallet = (user.walletAddress || '').trim().toLowerCase();

    const currentSync = centralEventSyncService.getState().teamTransactions;
    if (currentSync && currentSync.length > 0) {
      setTxState({ isRealData: true, transactions: currentSync });
    }

    if (cleanWallet) {
      mdefiService.getTeamTransactions(cleanWallet).then((res) => {
        if (isMounted && res && Array.isArray(res.transactions) && res.transactions.length > 0) {
          setTxState((prev) => {
            const recordMap = new Map<string, TeamTransactionRecord>();
            prev.transactions.forEach((tx) => recordMap.set(tx.id, tx));
            res.transactions.forEach((tx) => recordMap.set(tx.id, tx));
            return {
              isRealData: true,
              transactions: Array.from(recordMap.values()),
            };
          });
        }
      }).catch((err) => {
        console.warn('[TeamView] Contract transactions sync notice:', err);
      });
    }

    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
      if (isMounted) {
        setSyncedMembers(syncState.teamMembers || []);
        const liveTxs = syncState.teamTransactions || [];
        setTxState((prev) => {
          const recordMap = new Map<string, TeamTransactionRecord>();
          prev.transactions.forEach((tx) => recordMap.set(tx.id, tx));
          liveTxs.forEach((tx) => recordMap.set(tx.id, tx));
          const transactions = Array.from(recordMap.values());
          return {
            isRealData: transactions.length > 0,
            transactions,
          };
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user.walletAddress]);

  const handleCopy = async (hashOrAddress: string) => {
    const ok = await copyFullAddress(hashOrAddress);
    if (ok) {
      setCopiedHash(hashOrAddress);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  type TeamCategory = 'direct' | 'total' | 'active' | 'inactive';
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('direct');
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  // Naya state level filter ke liye (default 'all' rahega)
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [levelMembersMap, setLevelMembersMap] = useState<Record<number, TeamMember[]>>({});
  const [isLevelLoading, setIsLevelLoading] = useState<boolean>(false);
  const [memberPage, setMemberPage] = useState<number>(1);
  const [memberCopiedAddress, setMemberCopiedAddress] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // 100% On-Chain Dynamic Member Extraction with Active/Inactive $10 Package Logic (Audited)
  const effectiveMembers = useMemo(() => {
    const memberMap = new Map<string, TeamMember>();
    const currentConnectedWallet = (user.walletAddress || '').trim().toLowerCase();

    // 1. Props और sync service के मेंबर्स लोड करें
    [...(members || []), ...syncedMembers].forEach((m) => {
      if (m && m.address && typeof m.address === 'string') {
        const cleanAddr = m.address.trim().toLowerCase();
        if (cleanAddr && cleanAddr !== currentConnectedWallet) {
          memberMap.set(cleanAddr, { ...m, address: m.address });
        }
      }
    });

    // 2. Real on-chain transactions से सभी डायरेक्ट पार्टनर्स निकालें
    txState.transactions.forEach((tx) => {
      const addr = (tx.memberWallet || '').trim().toLowerCase();
      // खुद के कनेक्टेड वॉलेट को टीम लिस्ट में शामिल न करें
      if (addr && addr !== currentConnectedWallet && !memberMap.has(addr)) {
        const rawUserId = tx.userId && !tx.userId.includes('(') ? tx.userId : `MDF-${addr.slice(2, 8).toUpperCase()}`;
        
        // Name Logic: अगर कस्टम नाम नहीं है तो यूजर का डायनामिक MDF ID ही नेम बनेगा
        const resolvedName = (tx as any).name && String((tx as any).name).trim().length > 0 
          ? String((tx as any).name).trim() 
          : rawUserId;

        memberMap.set(addr, {
          id: tx.id || `member-${addr}`,
          userId: rawUserId,
          name: resolvedName,
          address: tx.memberWallet,
          joinedDate: tx.date || 'On-Chain Verified',
          status: 'Inactive', // Phase 1: डिफ़ॉल्ट इनएक्टिव (Pending $10 package)
          activePackages: 0,
          isDirect: true,
          level: 1,
          sponsor: user.userId || 'Your Account',
        } as TeamMember);
      }
    });

   // 3. यदि पार्टनर का पैकेज एक्टिवेशन ऑन-चेन मिला तो उसे Active मार्क करें
    txState.transactions.forEach((tx) => {
      const act = (tx.activityType || '').toLowerCase();
      const pkg = (tx.packageName || '').toLowerCase();
      const addr = (tx.memberWallet || '').trim().toLowerCase();
      if ((act.includes('package') || pkg.includes('junior') || pkg.includes('10')) && memberMap.has(addr)) {
        const existing = memberMap.get(addr)!;
        memberMap.set(addr, {
          ...existing,
          status: 'Active',
          activePackages: Math.max(1, existing.activePackages || 1),
        });
      }
    });

    // 4. Multi-Tier Real On-Chain Downline Injection (Level 2 to Level 10)
    // Agar user ne Level 2 se 10 select kiya hai aur uska real data fetch ho chuka hai, toh usko inject karein
    if (selectedLevel >= 2 && levelMembersMap[selectedLevel]) {
      levelMembersMap[selectedLevel].forEach((m) => {
        const cleanAddr = (m.address || '').trim().toLowerCase();
        if (cleanAddr && cleanAddr !== currentConnectedWallet && !memberMap.has(cleanAddr)) {
          memberMap.set(cleanAddr, m);
        }
      });
    }

    return Array.from(memberMap.values());
  }, [members, syncedMembers, txState.transactions, user.walletAddress, user.userId, user.totalTeamCount]);

  const directMembers = useMemo(() => effectiveMembers.filter((m) => m.isDirect || m.level === 1), [effectiveMembers]);
  const totalMembers = effectiveMembers;
  const activeMembers = useMemo(() => effectiveMembers.filter((m) => m.status === 'Active'), [effectiveMembers]);
  const inactiveMembers = useMemo(() => effectiveMembers.filter((m) => m.status === 'Inactive'), [effectiveMembers]);

  const directCount = user.directTeamCount !== undefined && user.directTeamCount > 0 
    ? user.directTeamCount 
    : directMembers.length;
  // Bug Fix: Overview की तरह Hub Smart Contract का रियल Total Team Count (e.g. 16) रेंडर होगा
  const totalCount = user.totalTeamCount !== undefined && user.totalTeamCount > 0 
    ? user.totalTeamCount 
    : Math.max(totalMembers.length, directCount);
  const activeCount = activeMembers.length;
  const inactiveCount = Math.max(0, totalCount - activeCount);

  const handleSelectCategory = (cat: TeamCategory) => {
    setSelectedCategory(cat);
    setMemberPage(1);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMemberCopy = async (address: string) => {
    const ok = await copyFullAddress(address);
    if (ok) {
      setMemberCopiedAddress(address);
      setTimeout(() => setMemberCopiedAddress(null), 2000);
    }
  };

  useEffect(() => {
    setMemberPage(1);
  }, [selectedCategory, memberSearchQuery]);

  // ON-DEMAND LEVEL FETCHING (LEVEL 2 TO 10): ZERO-RPC FLOOD
  useEffect(() => {
    let isMounted = true;
    const cleanWallet = (user.walletAddress || '').trim().toLowerCase();

    // 1. Agar Level 1 hai ya wallet connect nahi hai, toh traversal ki zaroorat nahi
    if (selectedLevel < 2 || !cleanWallet || !ethers.isAddress(cleanWallet)) {
      return;
    }

    // 2. Agar is level ka data pehle se memory me aa chuka hai, toh dobara 0 RPC call
    if (levelMembersMap[selectedLevel] && levelMembersMap[selectedLevel].length > 0) {
      return;
    }

    const fetchLevelData = async () => {
      try {
        setIsLevelLoading(true);
        const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com', undefined, { staticNetwork: true });
        const res = await getTeamLevelOnChain(provider, cleanWallet, selectedLevel);

        if (!isMounted) return;

        if (res && Array.isArray(res.members)) {
          const formattedMembers: TeamMember[] = res.members.map((node) => {
            const numId = Number(node.id);
            const displayId = numId > 0 ? (numId < 100000 ? 248160 + numId : numId) : 0;
            const d = node.registrationTime > 0 ? new Date(node.registrationTime * 1000) : new Date();

            return {
              id: `node-${node.wallet}`,
              address: node.wallet,
              userId: displayId > 0 ? `MDF-${displayId}` : 'MDF-User',
              name: displayId > 0 ? `MDF-${displayId}` : 'MDF-User',
              package: 'Starter Pool',
              status: node.isBlocked ? 'Inactive' : 'Active',
              joinedDate: d.toISOString().split('T')[0],
              volumeUSDT: 0,
              isDirect: false,
              directPartners: Array.isArray(node.directTeam) ? node.directTeam.length : 0,
              sponsor: node.upline || 'Your Account',
              level: selectedLevel,
              activePackages: node.isBlocked ? 0 : 1,
            };
          });

          setLevelMembersMap((prev) => ({
            ...prev,
            [selectedLevel]: formattedMembers,
          }));
        }
      } catch (err) {
        console.warn(`[TeamView] On-demand Level ${selectedLevel} fetch notice:`, err);
      } finally {
        if (isMounted) {
          setIsLevelLoading(false);
        }
      }
    };

    fetchLevelData();

    return () => {
      isMounted = false;
    };
  }, [selectedLevel, user.walletAddress]);

  const activeCategoryList = useMemo(() => {
    let list: TeamMember[] = [];
    if (selectedCategory === 'direct') {
      list = directMembers;
    } else if (selectedCategory === 'active') {
      list = activeMembers;
    } else if (selectedCategory === 'inactive') {
      list = inactiveMembers;
    } else {
      list = totalMembers;
    }

    // Strict Level Filter logic: Selected level ke members ko filter kare
    list = list.filter((m) => {
      const memberLevel = m.level || (m.isDirect ? 1 : 2);
      return memberLevel === selectedLevel;
    });

    return [...list].sort((a, b) => {
      const timeA = new Date(a.joinedDate).getTime() || 0;
      const timeB = new Date(b.joinedDate).getTime() || 0;
      return timeB - timeA;
    });
  }, [selectedCategory, selectedLevel, directMembers, activeMembers, inactiveMembers, totalMembers]);

  const filteredMembers = useMemo(() => {
    if (!memberSearchQuery.trim()) return activeCategoryList;
    const q = memberSearchQuery.toLowerCase().trim();
    return activeCategoryList.filter((m) => {
      const matchesId = m.userId ? m.userId.toLowerCase().includes(q) : false;
      const matchesAddress = m.address ? m.address.toLowerCase().includes(q) : false;
      const matchesName = m.name ? m.name.toLowerCase().includes(q) : false;
      const matchesSponsor = m.sponsor ? m.sponsor.toLowerCase().includes(q) : false;
      return matchesId || matchesAddress || matchesName || matchesSponsor;
    });
  }, [activeCategoryList, memberSearchQuery]);

  const memberPageSize = 15;
  const memberTotalPages = Math.ceil(filteredMembers.length / memberPageSize);
  const currentMemberPage = Math.min(memberPage, Math.max(1, memberTotalPages));

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentMemberPage - 1) * memberPageSize;
    return filteredMembers.slice(startIndex, startIndex + memberPageSize);
  }, [filteredMembers, currentMemberPage, memberPageSize]);

  const [txPage, setTxPage] = useState<number>(1);
  const txPageSize = 15;

  useEffect(() => {
    setTxPage(1);
  }, [txFilter, txSearchQuery]);

  const filteredTransactions = useMemo(() => {
    return txState.transactions.filter((tx) => {
      if (txFilter !== 'All') {
        const typeNormalized = (tx.activityType || '').toLowerCase();
        const filterNormalized = txFilter.toLowerCase();
        if (!typeNormalized.includes(filterNormalized)) {
          return false;
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
  }, [txState.transactions, txFilter, txSearchQuery]);

  const pagedTransactions = useMemo(() => {
    const startIndex = (txPage - 1) * txPageSize;
    return filteredTransactions.slice(startIndex, startIndex + txPageSize);
  }, [filteredTransactions, txPage, txPageSize]);

  const mobileTxPairs = useMemo(() => {
    return groupActivitiesInPairs(pagedTransactions);
  }, [pagedTransactions]);

  const txFilterTabs = ['All', 'Package Activation', 'Direct Referral', 'Matrix Income', 'Weekly Reward', 'Weekly Salary'];

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
              Network Architecture
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono">
              7-Tier Depth
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Team & Referral Network
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage frontline referred partners, view staking volume, and monitor matrix node health.
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenMatrixModal();
          }}
          className="relative group py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-zinc-950 border border-emerald-500/40 hover:border-emerald-400/80 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer overflow-hidden active:scale-[0.98] self-start sm:self-auto"
        >
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <Network className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-200" />
          <span>View Matrix Tree</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/70 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => handleSelectCategory('direct')}
          className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer group relative backdrop-blur-xl ${
            selectedCategory === 'direct'
              ? 'bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
              : 'bg-zinc-900/40 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-zinc-900/70 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Direct Partners</span>
            <div className={`p-1.5 rounded-lg transition-colors ${
              selectedCategory === 'direct' ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/70'
            }`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{directCount}</span>
            {selectedCategory === 'direct' ? (
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Viewing Table ↓
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                Open list →
              </span>
            )}
          </div>
          <span className="text-[11px] text-zinc-400 block mt-1">Level 1 frontline referrers</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('total')}
          className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer group relative backdrop-blur-xl ${
            selectedCategory === 'total'
              ? 'bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
              : 'bg-zinc-900/40 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-zinc-900/70 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Team</span>
            <div className={`p-1.5 rounded-lg transition-colors ${
              selectedCategory === 'total' ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/70'
            }`}>
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{totalCount}</span>
            {selectedCategory === 'total' ? (
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Viewing Table ↓
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                Open list →
              </span>
            )}
          </div>
          <span className="text-[11px] text-zinc-400 block mt-1">Total network downline</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('active')}
          className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer group relative backdrop-blur-xl ${
            selectedCategory === 'active'
              ? 'bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
              : 'bg-zinc-900/40 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-zinc-900/70 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Active Members</span>
            <div className={`p-1.5 rounded-lg transition-colors ${
              selectedCategory === 'active' ? 'bg-emerald-500 text-zinc-950' : 'bg-emerald-950/60 text-emerald-400 group-hover:bg-emerald-900/70'
            }`}>
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{activeCount}</span>
            {selectedCategory === 'active' ? (
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Viewing Table ↓
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                Open list →
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-400 block mt-1 font-mono">Generating daily yield</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('inactive')}
          className={`p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer group relative backdrop-blur-xl ${
            selectedCategory === 'inactive'
              ? 'bg-emerald-950/40 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/50'
              : 'bg-zinc-900/40 border border-emerald-500/20 hover:border-emerald-500/40 hover:bg-zinc-900/70 hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Inactive Members</span>
            <div className={`p-1.5 rounded-lg transition-colors ${
              selectedCategory === 'inactive' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'
            }`}>
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-zinc-400 font-mono">{inactiveCount}</span>
            {selectedCategory === 'inactive' ? (
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                Viewing Table ↓
              </span>
            ) : (
              <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                Open list →
              </span>
            )}
          </div>
          <span className="text-[11px] text-zinc-500 block mt-1">Pending package activation</span>
        </button>
      </div>

      <div 
        id="team-member-explorer"
        ref={tableContainerRef} 
        className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                {selectedCategory === 'direct' ? 'FRONTLINE NETWORK • TIER 1' : 
                 selectedCategory === 'total' ? 'FULL DOWNLINE • ALL TIERS' : 
                 selectedCategory === 'active' ? 'YIELD ACTIVE • COMMISSION GENERATING' : 'PENDING ACTIVATION'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {selectedCategory === 'direct' && <Users className="w-6 h-6 text-emerald-400 inline" />}
              {selectedCategory === 'total' && <Network className="w-6 h-6 text-emerald-400 inline" />}
              {selectedCategory === 'active' && <UserCheck className="w-6 h-6 text-emerald-400 inline" />}
              {selectedCategory === 'inactive' && <UserX className="w-6 h-6 text-zinc-400 inline" />}
              <span>
                {selectedCategory === 'direct' ? 'DIRECT PARTNERS' :
                 selectedCategory === 'total' ? 'TOTAL TEAM' :
                 selectedCategory === 'active' ? 'ACTIVE MEMBERS' : 'INACTIVE MEMBERS'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {selectedCategory === 'direct' ? 'Frontline Tier-1 partners directly sponsored by your account' :
               selectedCategory === 'total' ? 'Complete downline network across all depth tiers and matrix lines' :
               selectedCategory === 'active' ? 'Network partners with active packages generating daily yield' :
               'Registered network accounts pending package activation'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>● LIVE TEAM NETWORK</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/60 border border-emerald-500/20 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleSelectCategory('direct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'direct'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Direct Partners</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'direct' ? 'bg-zinc-950/30 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {directMembers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('total')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'total'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Total Team</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'total' ? 'bg-zinc-950/30 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'active'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Active</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'active' ? 'bg-zinc-950/30 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {activeMembers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'inactive'
                  ? 'bg-emerald-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Inactive</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'inactive' ? 'bg-zinc-950/30 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {inactiveMembers.length}
              </span>
            </button>
          </div>

          {/* Web3 Live Explore User & Smart Search */}
          <div className="w-full md:w-auto">
            <ExploreUser
              user={user}
              members={effectiveMembers}
              transactions={txState.transactions}
              searchQuery={memberSearchQuery}
              onSearchChange={setMemberSearchQuery}
            />
          </div>
        </div>
       {/* Level 1 to 10 Premium Grid Filter Bar (Strictly Level-by-Level) */}
        {selectedCategory === 'total' && (
          <div className="p-3 rounded-2xl bg-zinc-950/90 border border-emerald-500/40 shadow-xl space-y-2.5 my-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400 animate-pulse" />
                Select Team Depth Tier (Level 1 - 10)
              </span>
            </div>

            {/* lg:grid-cols-10 kiya gaya hai taaki 10 box ekdum perfect fit baithein */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
              {/* Level 1 to 10 Boxes with Unique Icons */}
              {[
                { lvl: 1, label: 'Level 1', icon: Users, color: 'text-cyan-400' },
                { lvl: 2, label: 'Level 2', icon: UserCheck, color: 'text-emerald-400' },
                { lvl: 3, label: 'Level 3', icon: ShieldCheck, color: 'text-yellow-400' },
                { lvl: 4, label: 'Level 4', icon: Award, color: 'text-amber-400' },
                { lvl: 5, label: 'Level 5', icon: Sparkles, color: 'text-purple-400' },
                { lvl: 6, label: 'Level 6', icon: Network, color: 'text-blue-400' },
                { lvl: 7, label: 'Level 7', icon: Cpu, color: 'text-rose-400' },
                { lvl: 8, label: 'Level 8', icon: Box, color: 'text-indigo-400' },
                { lvl: 9, label: 'Level 9', icon: UserPlus, color: 'text-teal-400' },
                { lvl: 10, label: 'Level 10', icon: CheckCircle2, color: 'text-emerald-300' },
              ].map(({ lvl, label, icon: IconComp, color }) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`p-2.5 rounded-xl text-xs font-mono font-bold transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                    selectedLevel === lvl
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-[1.02]'
                      : 'bg-zinc-900/80 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-emerald-500/30'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${selectedLevel === lvl ? 'text-zinc-950' : color}`} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {isLevelLoading ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-zinc-950/60 border border-emerald-500/30 backdrop-blur-xl flex flex-col items-center justify-center space-y-3 animate-in fade-in duration-200">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Network className="w-5 h-5 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold font-mono text-emerald-300">Fetching On-Chain Level {selectedLevel} Data...</p>
              <p className="text-[11px] font-mono text-zinc-400 mt-0.5">Scanning Multicall3 node contracts directly from BSC Testnet</p>
            </div>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-zinc-950/40 border border-dashed border-zinc-800">
            <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-300">No members found</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              No matching records found for "{memberSearchQuery}". Try another search term or clear the filter.
            </p>
            {memberSearchQuery && (
              <button
                type="button"
                onClick={() => setMemberSearchQuery('')}
                className="mt-4 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono hover:bg-emerald-500/30 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : selectedCategory === 'direct' ? (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-3 pl-3 font-semibold">User ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Address</th>
                    <th className="pb-3 font-semibold">Joining Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Active Packages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {paginatedMembers.map((m) => {
                    const isCopied = memberCopiedAddress === m.address;
                    const hasName = Boolean(m.name && m.name.trim().length > 0);
                    const packageCount = m.activePackages !== undefined ? m.activePackages : (m.status === 'Active' ? 1 : 0);

                    return (
                      <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="py-3 pl-3 text-emerald-400 font-bold">
                          {m.userId || m.id}
                        </td>
                        <td className="py-3">
                          <span className="text-zinc-200 font-medium font-sans">
                            {m.name && m.name.trim().length > 0 ? m.name : (m.userId || m.id)}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300">{formatCompactAddress(m.address)}</span>
                            <button
                              type="button"
                              onClick={() => handleMemberCopy(m.address)}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Copy full address"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{m.joinedDate}</span>
                          </span>
                        </td>
                        <td className="py-3">
                          {m.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {packageCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{packageCount} {packageCount === 1 ? 'Package' : 'Packages'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                              <span>0 Packages</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-2.5">
              {paginatedMembers.map((m) => {
                const isCopied = memberCopiedAddress === m.address;
                const hasName = Boolean(m.name && m.name.trim().length > 0);
                const packageCount = m.activePackages !== undefined ? m.activePackages : (m.status === 'Active' ? 1 : 0);

                return (
                  <div 
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 space-y-2.5 font-mono text-xs w-full min-w-0 max-w-full overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-zinc-500 text-[10px]">ID:</span>
                        <span className="text-emerald-400 font-bold text-sm">{m.userId || m.id}</span>
                      </div>
                      {m.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900">
                      <div className="min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Name</span>
                        <span className="text-zinc-200 truncate font-sans font-medium">
                          {m.name && m.name.trim().length > 0 ? m.name : (m.userId || m.id)}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-zinc-500 text-[10px] block">Active Packages</span>
                        {packageCount > 0 ? (
                          <span className="text-emerald-300 font-bold flex items-center gap-1 justify-end">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            <span>{packageCount}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-500">0</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900/80 text-[11px]">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-zinc-400 truncate">{formatCompactAddress(m.address)}</span>
                        <button
                          type="button"
                          onClick={() => handleMemberCopy(m.address)}
                          className="p-1 text-zinc-400 hover:text-emerald-400 shrink-0 cursor-pointer"
                          title="Copy address"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 shrink-0 text-[10px]">
                        <Clock className="w-3 h-3" />
                        <span>{m.joinedDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-3 pl-3 font-semibold">User ID</th>
                    <th className="pb-3 font-semibold">Name</th>
                    <th className="pb-3 font-semibold">Sponsor</th>
                    <th className="pb-3 font-semibold">User Address</th>
                    <th className="pb-3 font-semibold">Joining Date</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Active Packages</th>
                    <th className="pb-3 pr-3 font-semibold text-right">Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {paginatedMembers.map((m) => {
                    const isCopied = memberCopiedAddress === m.address;
                    const hasName = Boolean(m.name && m.name.trim().length > 0);
                    const packageCount = m.activePackages !== undefined ? m.activePackages : (m.status === 'Active' ? 1 : 0);
                    const memberLevel = m.level || (m.isDirect ? 1 : 2);

                    return (
                      <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="py-3 pl-3 text-emerald-400 font-bold">
                          {m.userId || m.id}
                        </td>
                        <td className="py-3">
                          <span className="text-zinc-200 font-medium font-sans">
                            {m.name && m.name.trim().length > 0 ? m.name : (m.userId || m.id)}
                          </span>
                        </td>
                        <td className="py-3 text-zinc-300">
                          <span className="flex items-center gap-1">
                            <UserPlus className="w-3 h-3 text-zinc-500" />
                            <span>{m.sponsor || user.userId || '-----'}</span>
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300">{formatCompactAddress(m.address)}</span>
                            <button
                              type="button"
                              onClick={() => handleMemberCopy(m.address)}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                              title="Copy address"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{m.joinedDate}</span>
                          </span>
                        </td>
                        <td className="py-3">
                          {m.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Active</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                              <span>Inactive</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {packageCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                              <Layers className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{packageCount}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 text-xs">
                              <span>0</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] border border-zinc-700">
                            <span>Level {memberLevel}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden space-y-2.5">
              {paginatedMembers.map((m) => {
                const isCopied = memberCopiedAddress === m.address;
                const hasName = Boolean(m.name && m.name.trim().length > 0);
                const packageCount = m.activePackages !== undefined ? m.activePackages : (m.status === 'Active' ? 1 : 0);
                const memberLevel = m.level || (m.isDirect ? 1 : 2);

                return (
                  <div 
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/20 space-y-2.5 font-mono text-xs w-full min-w-0 max-w-full overflow-hidden shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold text-sm">{m.userId || m.id}</span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                          L{memberLevel}
                        </span>
                      </div>
                      {m.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-zinc-400 border border-zinc-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900">
                      <div className="min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Name</span>
                        <span className="text-zinc-200 truncate font-sans font-medium">
                          {m.name && m.name.trim().length > 0 ? m.name : (m.userId || m.id)}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-zinc-500 text-[10px] block">Packages</span>
                        {packageCount > 0 ? (
                          <span className="text-emerald-300 font-bold flex items-center gap-1 justify-end">
                            <Layers className="w-3 h-3 text-emerald-400" />
                            <span>{packageCount}</span>
                          </span>
                        ) : (
                          <span className="text-zinc-500">0</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900/80 text-[11px]">
                      <div className="min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Sponsor</span>
                        <span className="text-zinc-300 font-mono text-[11px] truncate block">
                          {m.sponsor || user.userId || '-----'}
                        </span>
                      </div>
                      <div className="text-right min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Address</span>
                        <div className="flex items-center gap-1 justify-end">
                          <span className="text-zinc-400">{formatCompactAddress(m.address)}</span>
                          <button
                            type="button"
                            onClick={() => handleMemberCopy(m.address)}
                            className="p-1 text-zinc-400 hover:text-emerald-400 cursor-pointer"
                            title="Copy address"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-zinc-900/80 text-zinc-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Joined {m.joinedDate}</span>
                      </span>
                      <span>Level {memberLevel} Node</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Member Table Pagination */}
        {filteredMembers.length > memberPageSize && (
          <div className="pt-2">
            <ResponsivePagination
              currentPage={currentMemberPage}
              totalItems={filteredMembers.length}
              pageSize={memberPageSize}
              onPageChange={(p) => setMemberPage(p)}
              showItemCount
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500 font-mono">
          <span>
            Showing {Math.min(filteredMembers.length, (currentMemberPage - 1) * memberPageSize + 1)}–{Math.min(filteredMembers.length, currentMemberPage * memberPageSize)} of {filteredMembers.length} records
          </span>
          <span className="text-zinc-400 text-center sm:text-right">
            ● Verified On-Chain Team Ledger
          </span>
        </div>
      </div>

      {/* TEAM ACTIVITIES FEED */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5">
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

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>● LIVE TEAM ACTIVITY</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800 overflow-x-auto max-w-full">
            {txFilterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setTxFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  txFilter === tab
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search type, wallet, hash..."
              value={txSearchQuery}
              onChange={(e) => setTxSearchQuery(e.target.value)}
              className="w-full sm:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

        {/* Desktop Transactions Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-mono text-[11px]">
                <th className="pb-3 font-semibold pl-2">Date & Time</th>
                <th className="pb-3 font-semibold">Activity Type</th>
                <th className="pb-3 font-semibold">Member / Wallet</th>
                <th className="pb-3 font-semibold">Package / Details</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right pr-2">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {pagedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-500 text-xs font-mono">
                    No on-chain team transactions found for this account. Real contract transactions will appear here.
                  </td>
                </tr>
              ) : (
                pagedTransactions.map((tx) => {
                  const visual = getTransactionVisual(tx.activityType, tx.status, tx.amount);
                  const IconComp = visual.icon;
                  const isCopied = copiedHash === tx.txHash;

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors group">
                      <td className="py-3.5 pl-2 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>

                      <td className="py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${visual.dotClass}`} />
                          <div className={`p-1.5 rounded-lg border ${visual.iconBgClass} ${visual.iconTextClass}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-zinc-100">
                            {tx.activityType}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 whitespace-nowrap font-mono text-[11px]">
                        <div className="flex items-center gap-2">
                          <div>
                            {tx.userId && (
                              <span className="text-emerald-400 font-bold block">
                                {tx.userId}
                              </span>
                            )}
                            <span className="text-zinc-400">
                              {formatCompactAddress(tx.memberWallet)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.memberWallet)}
                            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Wallet Address"
                          >
                            {copiedHash === tx.memberWallet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 text-zinc-300 text-xs">
                        {tx.packageName ? (
                          <div className="space-y-0.5">
                            <span className="font-semibold text-emerald-300 block">
                              {tx.packageName}
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              {tx.details || 'Smart contract package registration'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs">
                            {tx.details || 'Community network referral reward'}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 whitespace-nowrap font-mono font-bold">
                        <span className={visual.amountClass}>
                          {tx.amount}
                        </span>
                      </td>

                      <td className="py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                        {tx.txHash ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-mono text-[11px] text-zinc-400 group-hover:text-emerald-300 transition-colors truncate max-w-[140px]" title={tx.txHash}>
                              {formatCompactAddress(tx.txHash)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(tx.txHash!)}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              title="Copy Transaction Hash"
                            >
                              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        ) : (
                          <span className="text-zinc-600 font-mono text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive 2-in-1 Transaction Cards */}
        <div className="md:hidden space-y-3">
          {pagedTransactions.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              No on-chain team transactions found for this account.
            </div>
          ) : (
            mobileTxPairs.map((pair, pIdx) => (
              <div 
                key={`team-pair-${pair[0]?.id || pIdx}`}
                className="rounded-2xl bg-zinc-950/80 border border-emerald-500/20 divide-y divide-zinc-850/80 overflow-hidden shadow-sm font-mono"
              >
                {pair.map((tx) => {
                  const visual = getTransactionVisual(tx.activityType, tx.status, tx.amount);
                  const IconComp = visual.icon;

                  return (
                    <div 
                      key={tx.id}
                      className="p-3.5 space-y-2.5 hover:bg-zinc-900/30 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${visual.iconBgClass} ${visual.iconTextClass}`}>
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-white block">
                              {tx.activityType}
                            </span>
                            {tx.packageName && (
                              <span className="text-[10px] text-emerald-400 font-mono block">
                                {tx.packageName}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`font-mono font-bold text-xs ${visual.amountClass}`}>
                            {tx.amount}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-zinc-500 text-[10px]">Partner:</span>
                          {tx.userId && (
                            <span className="text-emerald-400 font-bold text-[10px]">
                              {tx.userId}
                            </span>
                          )}
                          <span className="text-zinc-400 truncate text-[11px]">
                            {formatCompactAddress(tx.memberWallet)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(tx.memberWallet)}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Copy Partner Address"
                        >
                          {copiedHash === tx.memberWallet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {tx.details && (
                        <p className="text-[11px] text-zinc-400 leading-relaxed truncate">
                          {tx.details}
                        </p>
                      )}

                      <div className="pt-1.5 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{tx.status}</span>
                          </span>
                          <span>{tx.date}</span>
                        </div>

                        {tx.txHash && (
                          <button
                            type="button"
                            onClick={() => handleCopy(tx.txHash!)}
                            className="inline-flex items-center gap-1 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Copy Tx Hash"
                          >
                            <span>{formatCompactAddress(tx.txHash)}</span>
                            {copiedHash === tx.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

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
          <span>Showing {pagedTransactions.length} of {filteredTransactions.length} filtered team transactions ({txState.transactions.length} total)</span>
          <span className="text-emerald-400">
            ● Real Web3 Mode Active
          </span>
        </div>
      </div>
    </div>
  );
};