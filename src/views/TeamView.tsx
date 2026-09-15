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
import { initialTeamMembers } from '../data/mockData';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { getTransactionVisual } from '../utils/transactionVisuals';
import { ResponsivePagination } from '../components/common/ResponsivePagination';
import { groupActivitiesInPairs } from '../components/activity/CompactActivityRow';

interface TeamViewProps {
  user: UserProfile;
  members: TeamMember[];
  onOpenMatrixModal: () => void;
  transactions?: TeamTransactionRecord[];
}

const DEMO_TEAM_TRANSACTIONS: TeamTransactionRecord[] = [
  {
    id: 'demo-team-1',
    activityType: 'Team Registration',
    memberWallet: '0x71C839Fa24e93C298B321f8a84620a3b221B389',
    userId: 'MDF-10389',
    packageName: 'Ecosystem Placement',
    amount: 'New Member',
    status: 'Confirmed',
    date: '3 min ago',
    timestamp: '3 min ago',
    details: 'Frontline direct partner joined ecosystem',
    txHash: '0x3f1c6b82aa12bb45cf8129ea4890bf29ca881742',
  },
  {
    id: 'demo-team-2',
    activityType: 'Package Activation',
    memberWallet: '0x9481cA82910fa321B098b8c29184910ea89b4182',
    userId: 'MDF-09511',
    packageName: 'Nexus Prime',
    amount: '$120 USDT',
    status: 'Confirmed',
    date: '8 min ago',
    timestamp: '8 min ago',
    details: 'Nexus Prime package active on-chain',
    txHash: '0x8e4a92f1b0a8c231ef6498b89410ef39acb2311f',
  },
  {
    id: 'demo-team-3',
    activityType: 'MBTTC Credit',
    memberWallet: '0xaB10839218d910AcFe9481928019481928410294',
    userId: 'MDF-10023',
    packageName: 'Team Reward',
    amount: '+50 MBTTC',
    status: 'Confirmed',
    date: '12 min ago',
    timestamp: '12 min ago',
    details: 'Direct partner referral bonus credited',
    txHash: '0x62bc40fa189c490e11894a28e4a92f1b0a8c231',
  },
  {
    id: 'demo-team-4',
    activityType: 'Matrix Income',
    memberWallet: '0x638210948Ac19028401928401928410948102948',
    userId: 'MDF-07820',
    packageName: 'S4 Radial Matrix',
    amount: '+$4.00 USDT',
    status: 'Confirmed',
    date: '18 min ago',
    timestamp: '18 min ago',
    details: 'Slot #4 re-entry commission generated',
    txHash: '0x88e39210aa4b12f0c19a84620a3b221b38910ef3',
  },
  {
    id: 'demo-team-5',
    activityType: 'Weekly Reward',
    memberWallet: '0x90214819204910AcFe9481928019481928410294',
    userId: 'MDF-09022',
    packageName: 'Starter Pool',
    amount: '+$175.50 USDT',
    status: 'Confirmed',
    date: '25 min ago',
    timestamp: '25 min ago',
    details: 'Weekly Reward Starter share distribution',
    txHash: '0x8f3c884a1e9e7b3c2a1d0f5e4b7a8c9d0e1f2a3b',
  },
  {
    id: 'demo-team-6',
    activityType: 'Weekly Salary',
    memberWallet: '0x82741094819204910AcFe9481928019481928410',
    userId: 'MDF-08119',
    packageName: 'Supervisor Pool',
    amount: '+$240.00 USDT',
    status: 'Confirmed',
    date: '31 min ago',
    timestamp: '31 min ago',
    details: 'Rank #1 Supervisor weekly stipend credited',
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
  },
  {
    id: 'demo-team-7',
    activityType: 'Package Activation',
    memberWallet: '0x38194810294810AcFe9481928019481928410294',
    userId: 'MDF-08712',
    packageName: 'Quantum Node',
    amount: '$70 USDT',
    status: 'Confirmed',
    date: '42 min ago',
    timestamp: '42 min ago',
    details: 'Quantum matrix position active',
    txHash: '0xd40711543c76a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
  },
  {
    id: 'demo-team-8',
    activityType: 'Matrix Income',
    memberWallet: '0x55121094810294810AcFe9481928019481928410',
    userId: 'MDF-09318',
    packageName: 'S4 Radial Matrix',
    amount: '+$14.00 USDT',
    status: 'Confirmed',
    date: '1 hour ago',
    timestamp: '1 hour ago',
    details: 'Radial matrix downline slot placement',
    txHash: '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
  },
  {
    id: 'demo-team-9',
    activityType: 'Package Activation',
    memberWallet: '0x10023810294810AcFe9481928019481928410294',
    userId: 'MDF-10023',
    packageName: 'Senior Node ($25)',
    amount: '$25 USDT',
    status: 'Confirmed',
    date: '1.5 hours ago',
    timestamp: '1.5 hours ago',
    details: 'S4 Senior Node direct activation',
    txHash: '0x295c66a980b1e2f3a4b5c6d7e8f9a0b1c2d3e4f5',
  },
  {
    id: 'demo-team-10',
    activityType: 'MBTTC Credit',
    memberWallet: '0x10114810294810AcFe9481928019481928410294',
    userId: 'MDF-10114',
    packageName: 'Referral Bonus',
    amount: '+25 MBTTC',
    status: 'Confirmed',
    date: '2 hours ago',
    timestamp: '2 hours ago',
    details: 'Referral incentive for community growth',
    txHash: '0x4b7e88c1a2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
  },
  {
    id: 'demo-team-11',
    activityType: 'Matrix Income',
    memberWallet: '0x08942810294810AcFe9481928019481928410294',
    userId: 'MDF-08942',
    packageName: 'S4 Radial Matrix',
    amount: '+$8.00 USDT',
    status: 'Confirmed',
    date: '3 hours ago',
    timestamp: '3 hours ago',
    details: 'Matrix level 2 overflow payout',
    txHash: '0x3a6d77b091c2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
  },
  {
    id: 'demo-team-12',
    activityType: 'Weekly Reward',
    memberWallet: '0x10490810294810AcFe9481928019481928410294',
    userId: 'MDF-10490',
    packageName: 'Starter Pool',
    amount: '+$160.00 USDT',
    status: 'Confirmed',
    date: '4 hours ago',
    timestamp: '4 hours ago',
    details: 'Cycle #12 weekly community pool rewards',
    txHash: '0x184b559870a0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
  },
  {
    id: 'demo-team-13',
    activityType: 'Package Activation',
    memberWallet: '0x10255810294810AcFe9481928019481928410294',
    userId: 'MDF-10255',
    packageName: 'Junior Node ($10)',
    amount: '$10 USDT',
    status: 'Confirmed',
    date: '5 hours ago',
    timestamp: '5 hours ago',
    details: 'Junior Node activation slot locked',
    txHash: '0x073a44876fa9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
  },
  {
    id: 'demo-team-14',
    activityType: 'Weekly Salary',
    memberWallet: '0x08119810294810AcFe9481928019481928410294',
    userId: 'MDF-08119',
    packageName: 'Supervisor Pool',
    amount: '+$240.00 USDT',
    status: 'Confirmed',
    date: '6 hours ago',
    timestamp: '6 hours ago',
    details: 'Epoch #12 leadership passive stipend',
    txHash: '0xf62933765e98c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
  },
  {
    id: 'demo-team-15',
    activityType: 'Direct Referral',
    memberWallet: '0x09418810294810AcFe9481928019481928410294',
    userId: 'MDF-09418',
    packageName: 'Onboarding Reward',
    amount: '+50 MBTTC',
    status: 'Confirmed',
    date: '7 hours ago',
    timestamp: '7 hours ago',
    details: 'Frontline partner onboarding commission',
    txHash: '0xe51822654d87b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
  },
  {
    id: 'demo-team-16',
    activityType: 'Matrix Income',
    memberWallet: '0x07611810294810AcFe9481928019481928410294',
    userId: 'MDF-07611',
    packageName: 'Nexus Prime Matrix',
    amount: '+$24.00 USDT',
    status: 'Confirmed',
    date: '8 hours ago',
    timestamp: '8 hours ago',
    details: 'Nexus radial matrix slot spillover',
    txHash: '0xd40711543c76a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
  },
  {
    id: 'demo-team-17',
    activityType: 'Package Activation',
    memberWallet: '0x07612810294810AcFe9481928019481928410294',
    userId: 'MDF-07612',
    packageName: 'Nexus Prime ($120)',
    amount: '$120 USDT',
    status: 'Confirmed',
    date: '10 hours ago',
    timestamp: '10 hours ago',
    details: 'Ecosystem package upgrade completed',
    txHash: '0x9063cd10983263748596a7b8c9d0e1f2a3b4c5d6',
  },
  {
    id: 'demo-team-18',
    activityType: 'Weekly Reward',
    memberWallet: '0x10619810294810AcFe9481928019481928410294',
    userId: 'MDF-10619',
    packageName: 'Starter Pool',
    amount: '+$152.00 USDT',
    status: 'Confirmed',
    date: '12 hours ago',
    timestamp: '12 hours ago',
    details: 'Week 11 team community distribution',
    txHash: '0xa174de210943748596a7b8c9d0e1f2a3b4c5d6e7',
  },
  {
    id: 'demo-team-19',
    activityType: 'Direct Referral',
    memberWallet: '0x10702810294810AcFe9481928019481928410294',
    userId: 'MDF-10702',
    packageName: 'Direct Commission',
    amount: '+20 MBTTC',
    status: 'Confirmed',
    date: '14 hours ago',
    timestamp: '14 hours ago',
    details: 'Direct referral incentive credited',
    txHash: '0xc39600432b6596a7b8c9d0e1f2a3b4c5d6e7f8a9',
  },
  {
    id: 'demo-team-20',
    activityType: 'Matrix Income',
    memberWallet: '0x10811810294810AcFe9481928019481928410294',
    userId: 'MDF-10811',
    packageName: 'S4 Radial Matrix',
    amount: '+$5.00 USDT',
    status: 'Confirmed',
    date: '16 hours ago',
    timestamp: '16 hours ago',
    details: 'Matrix commission from downline activation',
    txHash: '0xb285ef321a548596a7b8c9d0e1f2a3b4c5d6e7f8',
  },
  {
    id: 'demo-team-21',
    activityType: 'Package Activation',
    memberWallet: '0x10812810294810AcFe9481928019481928410294',
    userId: 'MDF-10812',
    packageName: 'Senior Node ($25)',
    amount: '$25 USDT',
    status: 'Confirmed',
    date: '18 hours ago',
    timestamp: '18 hours ago',
    details: 'Senior Node package confirmed',
    txHash: '0x8f52bc0987215263748596a7b8c9d0e1f2a3b4c5',
  },
  {
    id: 'demo-team-22',
    activityType: 'Weekly Salary',
    memberWallet: '0x10919810294810AcFe9481928019481928410294',
    userId: 'MDF-10919',
    packageName: 'Supervisor Pool',
    amount: '+$240.00 USDT',
    status: 'Confirmed',
    date: '20 hours ago',
    timestamp: '20 hours ago',
    details: 'Leadership stipend disbursement confirmed',
    txHash: '0x7e41ab987610415263748596a7b8c9d0e1f2a3b4',
  },
  {
    id: 'demo-team-23',
    activityType: 'Direct Referral',
    memberWallet: '0x11029810294810AcFe9481928019481928410294',
    userId: 'MDF-11029',
    packageName: 'Direct Commission',
    amount: '+50 MBTTC',
    status: 'Confirmed',
    date: '22 hours ago',
    timestamp: '22 hours ago',
    details: 'Direct referral bonus for onboarding',
    txHash: '0x6d309a87650930415263748596a7b8c9d0e1f2a3',
  },
  {
    id: 'demo-team-24',
    activityType: 'Matrix Income',
    memberWallet: '0x11102810294810AcFe9481928019481928410294',
    userId: 'MDF-11102',
    packageName: 'S4 Radial Matrix',
    amount: '+$4.00 USDT',
    status: 'Confirmed',
    date: '1 day ago',
    timestamp: '1 day ago',
    details: 'Radial matrix re-entry slot completed',
    txHash: '0x5c3388bb4510ad69fa8490ec38194ad611894b90',
  },
];

export const TeamView: React.FC<TeamViewProps> = ({
  user,
  members,
  onOpenMatrixModal,
  transactions: initialTransactions,
}) => {
  // Team Transaction History State (Real Web3 vs Demo Fallback Architecture)
  const [txState, setTxState] = useState<{ isRealData: boolean; transactions: TeamTransactionRecord[] }>({
    isRealData: false,
    transactions: initialTransactions && initialTransactions.length > 0 ? initialTransactions : DEMO_TEAM_TRANSACTIONS,
  });
  const [txFilter, setTxFilter] = useState<string>('All');
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Load team transactions from service (maintaining Demo fallback until real Web3 contract is connected)
  useEffect(() => {
    let isMounted = true;
    const syncTx = centralEventSyncService.getState().teamTransactions;

    if (initialTransactions && initialTransactions.length > 0) {
      const merged = [...syncTx, ...initialTransactions.filter((t) => !syncTx.some((st) => st.id === t.id))];
      setTxState({ isRealData: false, transactions: merged });
      return;
    }

    mdefiService.getTeamTransactions(user.walletAddress).then((res) => {
      if (isMounted) {
        const base = (res.isRealData && res.transactions.length > 0) ? res.transactions : DEMO_TEAM_TRANSACTIONS;
        const merged = [...syncTx, ...base.filter((t) => !syncTx.some((st) => st.id === t.id))];
        setTxState({ isRealData: res.isRealData, transactions: merged });
      }
    }).catch((err) => {
      console.warn('[TeamView] Error fetching team transactions:', err);
      if (isMounted) {
        const merged = [...syncTx, ...DEMO_TEAM_TRANSACTIONS.filter((t) => !syncTx.some((st) => st.id === t.id))];
        setTxState({ isRealData: false, transactions: merged });
      }
    });

    // Reactive subscription to Central Event Sync for real-time team transactions
    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
      if (isMounted && syncState.teamTransactions.length > 0) {
        setTxState((prev) => {
          const fresh = syncState.teamTransactions;
          const merged = [...fresh, ...prev.transactions.filter((t) => !fresh.some((st) => st.id === t.id))];
          return { isRealData: prev.isRealData, transactions: merged };
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user.walletAddress, initialTransactions]);

  const handleCopy = async (hashOrAddress: string) => {
    const ok = await copyFullAddress(hashOrAddress);
    if (ok) {
      setCopiedHash(hashOrAddress);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  // --- TEAM MEMBER DIRECTORY STATE & DATA ---
  type TeamCategory = 'direct' | 'total' | 'active' | 'inactive';
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('direct');
  const [memberSearchQuery, setMemberSearchQuery] = useState<string>('');
  const [memberPage, setMemberPage] = useState<number>(1);
  const [memberCopiedAddress, setMemberCopiedAddress] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const effectiveMembers = useMemo(() => {
    const centralMembers = centralEventSyncService.getState().teamMembers;
    const combined = [...(members || [])];
    centralMembers.forEach((cm) => {
      if (!combined.some((m) => m.userId.toLowerCase() === cm.userId.toLowerCase())) {
        combined.unshift(cm);
      }
    });
    return combined.length > 0 ? combined : initialTeamMembers;
  }, [members]);

  const directMembers = useMemo(() => effectiveMembers.filter((m) => m.isDirect || m.level === 1), [effectiveMembers]);
  const totalMembers = effectiveMembers;
  const activeMembers = useMemo(() => effectiveMembers.filter((m) => m.status === 'Active'), [effectiveMembers]);
  const inactiveMembers = useMemo(() => effectiveMembers.filter((m) => m.status === 'Inactive'), [effectiveMembers]);

  // Synchronized statistics derived directly from verified member lists
  const directCount = directMembers.length;
  const totalCount = totalMembers.length;
  const activeCount = activeMembers.length;
  const inactiveCount = inactiveMembers.length;

  // Handler to select category from stat cards or tabs
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

  // Reset member page when category or search changes
  useEffect(() => {
    setMemberPage(1);
  }, [selectedCategory, memberSearchQuery]);

  // Active category records sorted newest first
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

    return [...list].sort((a, b) => {
      const timeA = new Date(a.joinedDate).getTime() || 0;
      const timeB = new Date(b.joinedDate).getTime() || 0;
      return timeB - timeA;
    });
  }, [selectedCategory, directMembers, activeMembers, inactiveMembers, totalMembers]);

  // Filtered members based on search (User ID, wallet address, name, sponsor)
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

  // Page limit: 5 for direct/total/active (3-5 pages), 4 for inactive (2 pages)
  const memberPageSize = selectedCategory === 'inactive' ? 4 : 5;
  const memberTotalPages = Math.ceil(filteredMembers.length / memberPageSize);
  const currentMemberPage = Math.min(memberPage, Math.max(1, memberTotalPages));

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentMemberPage - 1) * memberPageSize;
    return filteredMembers.slice(startIndex, startIndex + memberPageSize);
  }, [filteredMembers, currentMemberPage, memberPageSize]);

  // Filtered transactions for Team Transaction History
  const [txPage, setTxPage] = useState<number>(1);
  const txPageSize = 6; // 6 records per page = 3 compact 2-in-1 pairs on mobile, 6 rows on desktop

  // Reset page when filter or search changes
  useEffect(() => {
    setTxPage(1);
  }, [txFilter, txSearchQuery]);

  const filteredTransactions = useMemo(() => {
    return txState.transactions.filter((tx) => {
      // Activity type filter
      if (txFilter !== 'All') {
        const typeNormalized = tx.activityType.toLowerCase();
        const filterNormalized = txFilter.toLowerCase();
        if (!typeNormalized.includes(filterNormalized)) {
          return false;
        }
      }

      // Search query filter
      if (txSearchQuery.trim()) {
        const q = txSearchQuery.toLowerCase();
        const matchesType = tx.activityType.toLowerCase().includes(q);
        const matchesWallet = tx.memberWallet.toLowerCase().includes(q);
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

  // Paged transactions for current page
  const pagedTransactions = useMemo(() => {
    const startIndex = (txPage - 1) * txPageSize;
    return filteredTransactions.slice(startIndex, startIndex + txPageSize);
  }, [filteredTransactions, txPage, txPageSize]);

  // Mobile 2-in-1 pairs
  const mobileTxPairs = useMemo(() => {
    return groupActivitiesInPairs(pagedTransactions);
  }, [pagedTransactions]);

  const txFilterTabs = ['All', 'Package Activation', 'Direct Referral', 'Matrix Income', 'Weekly Reward', 'Weekly Salary'];

  return (
    <div className="space-y-7 animate-in fade-in duration-300 pb-28 lg:pb-12">
      {/* Header with Premium Web3 "View Matrix Tree" Button */}
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

        {/* Premium Web3 "View Matrix Tree" Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenMatrixModal();
          }}
          className="relative group py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-950/90 to-zinc-950 border border-emerald-500/40 hover:border-emerald-400/80 text-emerald-300 hover:text-white text-xs font-bold flex items-center gap-2.5 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer overflow-hidden active:scale-[0.98] self-start sm:self-auto"
        >
          {/* Subtle light sweep animation passing periodically */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
          <Network className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform duration-200" />
          <span>View Matrix Tree</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400/70 group-hover:translate-x-0.5 transition-transform duration-200" />
        </button>
      </div>

      {/* TOP STATISTICS CARDS: Direct Partners, Total Team, Active Members, Inactive Members (CLICKABLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Direct Partners */}
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

        {/* 2. Total Team */}
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

        {/* 3. Active Members */}
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

        {/* 4. Inactive Members */}
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

      {/* TEAM MEMBER EXPLORER SECTION (INTERACTIVE DIRECTORY & SEARCH) */}
      <div 
        id="team-member-explorer"
        ref={tableContainerRef} 
        className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5"
      >
        {/* Explorer Header & Source Tag */}
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

          {/* Real vs Demo Badge */}
          {txState.isRealData ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>● LIVE TEAM NETWORK</span>
            </div>
          ) : (
            <div className="inline-flex flex-col items-end">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>● DEMO TEAM DATA</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">
                DEMO / SIMULATED
              </span>
            </div>
          )}
        </div>

        {/* Category Switcher Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          {/* Category Tabs */}
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
                {totalMembers.length}
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

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              placeholder="Search by User ID or wallet address..."
              className="w-full bg-zinc-950/80 border border-emerald-500/20 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors font-mono"
            />
            {memberSearchQuery && (
              <button
                type="button"
                onClick={() => setMemberSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* MEMBERS CONTENT: DESKTOP TABLE & MOBILE CARD ROWS */}
        {filteredMembers.length === 0 ? (
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
          /* =========================================================
             CATEGORY 1: DIRECT PARTNERS TABLE (6 SPECIFIC COLUMNS)
             Columns: User ID | Name | Address | Joining Date | Status | Active Packages
             ========================================================= */
          <div>
            {/* Desktop Table */}
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
                        {/* 1. User ID */}
                        <td className="py-3 pl-3 text-emerald-400 font-bold">
                          {m.userId || m.id}
                        </td>

                        {/* 2. Name */}
                        <td className="py-3">
                          {hasName ? (
                            <span className="text-zinc-200 font-medium font-sans">{m.name}</span>
                          ) : (
                            <span className="text-zinc-500">-----</span>
                          )}
                        </td>

                        {/* 3. Address + copy icon */}
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300">{formatCompactAddress(m.address)}</span>
                            <button
                              type="button"
                              onClick={() => handleMemberCopy(m.address)}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
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

                        {/* 4. Joining Date */}
                        <td className="py-3 text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{m.joinedDate}</span>
                          </span>
                        </td>

                        {/* 5. Status */}
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

                        {/* 6. Active Packages */}
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

            {/* Mobile Compact Card Rows (No overflow, responsive layout) */}
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
                    {/* Top Row: User ID + Status */}
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

                    {/* Middle Row: Name & Active Packages */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900">
                      <div className="min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Name</span>
                        <span className="text-zinc-200 truncate font-sans font-medium">
                          {hasName ? m.name : '-----'}
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

                    {/* Address & Joining Date */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900/80 text-[11px]">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-zinc-400 truncate">{formatCompactAddress(m.address)}</span>
                        <button
                          type="button"
                          onClick={() => handleMemberCopy(m.address)}
                          className="p-1 text-zinc-400 hover:text-emerald-400 shrink-0"
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
          /* =========================================================
             CATEGORIES 2, 3, 4: TOTAL / ACTIVE / INACTIVE TEAM TABLES
             Columns: User ID | Name | Sponsor | User Address | Joining Date | Status | Active Packages | Level
             ========================================================= */
          <div>
            {/* Desktop Table */}
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
                        {/* 1. User ID */}
                        <td className="py-3 pl-3 text-emerald-400 font-bold">
                          {m.userId || m.id}
                        </td>

                        {/* 2. Name */}
                        <td className="py-3">
                          {hasName ? (
                            <span className="text-zinc-200 font-medium font-sans">{m.name}</span>
                          ) : (
                            <span className="text-zinc-500">-----</span>
                          )}
                        </td>

                        {/* 3. Sponsor */}
                        <td className="py-3 text-zinc-300">
                          <span className="flex items-center gap-1">
                            <UserPlus className="w-3 h-3 text-zinc-500" />
                            <span>{m.sponsor || user.userId || '-----'}</span>
                          </span>
                        </td>

                        {/* 4. User Address */}
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-300">{formatCompactAddress(m.address)}</span>
                            <button
                              type="button"
                              onClick={() => handleMemberCopy(m.address)}
                              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-emerald-400 transition-colors"
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

                        {/* 5. Joining Date */}
                        <td className="py-3 text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            <span>{m.joinedDate}</span>
                          </span>
                        </td>

                        {/* 6. Status */}
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

                        {/* 7. Active Packages */}
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

                        {/* 8. Level */}
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

            {/* Mobile Compact Card Rows (No overflow, responsive layout) */}
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
                    {/* Top Row: User ID + Level Badge + Status */}
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

                    {/* Middle Row: Name & Active Packages */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-900">
                      <div className="min-w-0">
                        <span className="text-zinc-500 text-[10px] block">Name</span>
                        <span className="text-zinc-200 truncate font-sans font-medium">
                          {hasName ? m.name : '-----'}
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

                    {/* Sponsor & Address */}
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
                            className="p-1 text-zinc-400 hover:text-emerald-400"
                            title="Copy address"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Joining Date Footer */}
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

        {/* Member Table Pagination: ONLY shown when records exceed page limit */}
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

        {/* Explorer Footer Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500 font-mono">
          <span>
            Showing {Math.min(filteredMembers.length, (currentMemberPage - 1) * memberPageSize + 1)}–{Math.min(filteredMembers.length, currentMemberPage * memberPageSize)} of {filteredMembers.length} records
          </span>
          <span className="text-zinc-400 text-center sm:text-right">
            {txState.isRealData 
              ? '● Verified On-Chain Team Ledger' 
              : '● Demo Network Ledger (Connect Wallet & Contracts for Live Data)'}
          </span>
        </div>
      </div>

      {/* TEAM ACTIVITIES FEED */}
      <div className="p-4 sm:p-6 rounded-3xl bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl space-y-5">
        {/* Header & Source Tag */}
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
            {/* Status Indicator Badge */}
            {txState.isRealData ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs font-mono font-bold text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>● LIVE TEAM ACTIVITY</span>
              </div>
            ) : (
              <div className="inline-flex flex-col items-end">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-xs font-mono font-bold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>● DEMO TEAM ACTIVITY</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-500 mt-0.5">
                  DEMO / SIMULATED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Filter tabs */}
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

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
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
                    {txState.isRealData 
                      ? 'No on-chain team transactions found for this account. Real contract transactions will appear here.' 
                      : 'No team transactions found matching your criteria.'}
                  </td>
                </tr>
              ) : (
                pagedTransactions.map((tx) => {
                  const visual = getTransactionVisual(tx.activityType, tx.status, tx.amount);
                  const IconComp = visual.icon;
                  const isCopied = copiedHash === tx.txHash;

                  return (
                    <tr key={tx.id} className="hover:bg-zinc-900/50 transition-colors group">
                      {/* Date */}
                      <td className="py-3.5 pl-2 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Activity Type with Icon */}
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

                      {/* Member Wallet + User ID */}
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
                            onClick={() => handleCopy(tx.memberWallet)}
                            className="p-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy Wallet Address"
                          >
                            {copiedHash === tx.memberWallet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Package / Event Details */}
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

                      {/* Amount */}
                      <td className="py-3.5 whitespace-nowrap font-mono font-bold">
                        <span className={visual.amountClass}>
                          {tx.amount}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                          tx.status === 'Confirmed'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${tx.status === 'Confirmed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                          {tx.status} {txState.isRealData ? '' : '(Demo)'}
                        </span>
                      </td>

                      {/* Tx Hash */}
                      <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                        {tx.txHash ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="font-mono text-[11px] text-zinc-400 group-hover:text-emerald-300 transition-colors truncate max-w-[140px]" title={tx.txHash}>
                              {formatCompactAddress(tx.txHash)}
                            </span>
                            <button
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

        {/* Mobile Responsive 2-in-1 Transaction Cards (<768px) */}
        <div className="md:hidden space-y-3">
          {pagedTransactions.length === 0 ? (
            <div className="py-8 text-center text-zinc-500 text-xs font-mono">
              {txState.isRealData 
                ? 'No on-chain team transactions found for this account.' 
                : 'No team transactions found matching your filter.'}
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
                      {/* Row 1: Type & Amount */}
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

                      {/* Row 2: Member Wallet & User ID */}
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
                          onClick={() => handleCopy(tx.memberWallet)}
                          className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                          title="Copy Partner Address"
                        >
                          {copiedHash === tx.memberWallet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Row 3: Details */}
                      {tx.details && (
                        <p className="text-[11px] text-zinc-400 leading-relaxed truncate">
                          {tx.details}
                        </p>
                      )}

                      {/* Row 4: Status + Date + Hash */}
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

        {/* Universal Pagination */}
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

        {/* Section footer */}
        <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Showing {pagedTransactions.length} of {filteredTransactions.length} filtered team transactions ({txState.transactions.length} total)</span>
          <span className="text-emerald-400">
            {txState.isRealData ? 'Real Web3 Mode Active' : 'Demo Fallback Mode Active'}
          </span>
        </div>
      </div>
    </div>
  );
};
