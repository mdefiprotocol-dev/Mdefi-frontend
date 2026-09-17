/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  RewardBalances, 
  PackageItem, 
  ActivityItem, 
  TeamMember, 
  NavPage 
} from './types';
import { 
  mockUserProfile, 
  mockRewardBalances, 
  mockPackages, 
  mockActivities, 
  mockTeamMembers 
} from './data/mockData';
import { mdefiService } from './services/mdefiService';
import { centralEventSyncService } from './services/centralEventSyncService';
import { contractAdapter } from './services/contractAdapter';
import { nexusContractService } from './services/nexusContractService';
import { packageActivationService } from './services/packageActivationService';
import { normalizeAndDeduplicateActivities, isDuplicateActivity } from './utils/notificationDeduplication';
import { formatCompactAddress } from './utils/formatAddress';

// Layout Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

// Modals & Feedback
import { ClaimModal } from './components/ClaimModal';
import { WalletModal } from './components/WalletModal';
import { MatrixModal } from './components/MatrixModal';
import { PackageModal } from './components/PackageModal';
import { Toast } from './components/Toast';
import { RewardPopup } from './components/RewardPopup';
import { playClaimSuccessSound } from './utils/successSound';

// Views
import { OverviewView } from './views/OverviewView';
import { MbttcView } from './views/MbttcView';
import { TeamView } from './views/TeamView';
import { PackagesView } from './views/PackagesView';
import { IncomeView } from './views/IncomeView';
import { TransactionsView } from './views/TransactionsView';
import { ProfileView } from './views/ProfileView';
import { HubView } from './views/HubView';
import { S4MatrixView } from './views/S4MatrixView';
import { QuantumNexusView } from './views/QuantumNexusView';
import { NexusPrimeView } from './views/NexusPrimeView';
import { WeeklyRewardStarterView } from './views/WeeklyRewardStarterView';
import { WeeklyRewardPremiumView } from './views/WeeklyRewardPremiumView';
import { WeeklyPassiveSalaryView } from './views/WeeklyPassiveSalaryView';
import { LandingPage } from './components/landing/LandingPage';
import { LanguageProvider } from './context/LanguageContext';
import { MBTTC_TOKEN_INFO } from './data/mbttcTokenInfo';
import { PhaseLockedView } from './components/common/PhaseLockedView';
import { programPhaseService } from './services/programPhaseService';

function MainApp() {
  // Application Mode: 'landing' (public front website) or 'dashboard' (main MDeFi dashboard)
  const [appMode, setAppMode] = useState<'landing' | 'dashboard'>('landing');

  // Navigation state
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [s4PackageFocus, setS4PackageFocus] = useState<'junior' | 'senior'>('junior');

  // Application Data State
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mdefi_user_profile');
      if (saved) return { ...mockUserProfile, ...JSON.parse(saved) };
    } catch {}
    return mockUserProfile;
  });
  const [rewards, setRewards] = useState<RewardBalances>(mockRewardBalances);
  const [packages, setPackages] = useState<PackageItem[]>(mockPackages);

  // Helper to load wallet-scoped notifications/activities from localStorage
  const loadActivitiesForWallet = (walletAddress: string): ActivityItem[] => {
    try {
      const key = `mdefi_notifications_${walletAddress.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return normalizeAndDeduplicateActivities(parsed, walletAddress);
        }
      }
    } catch {}

    // Initial seed for primary default wallet
    if (walletAddress.toLowerCase() === mockUserProfile.walletAddress.toLowerCase()) {
      const seeded = mockActivities.map((act) => ({
        ...act,
        walletAddress,
        read: act.read ?? false,
      }));
      return normalizeAndDeduplicateActivities(seeded, walletAddress);
    }

    return [];
  };

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    return loadActivitiesForWallet(user.walletAddress);
  });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);

  // Master reactive subscription to Central Event Sync (Single Source of Truth)
  useEffect(() => {
    // Initial sync
    setActivities(loadActivitiesForWallet(user.walletAddress));

    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
      // Synchronize activities for the connected wallet
      const walletActs = normalizeAndDeduplicateActivities(syncState.activities, user.walletAddress);
      if (walletActs.length > 0) {
        setActivities((prev) => {
          const merged = normalizeAndDeduplicateActivities([...walletActs, ...prev], user.walletAddress);
          try {
            localStorage.setItem(
              `mdefi_notifications_${user.walletAddress.toLowerCase()}`,
              JSON.stringify(merged)
            );
          } catch {}
          return merged;
        });
      }

      // Synchronize team members
      setTeamMembers(syncState.teamMembers);

      // Synchronize direct & total team counts
      setUser((prev) => {
        if (
          prev.directTeamCount !== syncState.directTeamCount ||
          prev.totalTeamCount !== syncState.totalTeamCount
        ) {
          return {
            ...prev,
            directTeamCount: syncState.directTeamCount,
            totalTeamCount: syncState.totalTeamCount,
          };
        }
        return prev;
      });
    });

    return unsubscribe;
  }, [user.walletAddress]);

  const saveActivities = (newActivities: ActivityItem[]) => {
    const deduplicated = normalizeAndDeduplicateActivities(newActivities, user.walletAddress);
    setActivities(deduplicated);
    try {
      localStorage.setItem(
        `mdefi_notifications_${user.walletAddress.toLowerCase()}`,
        JSON.stringify(deduplicated)
      );
    } catch {}
  };

  // Add new activity with multi-tier deterministic duplicate prevention
  const addActivity = (item: ActivityItem) => {
    setActivities((prev) => {
      const itemWithWallet: ActivityItem = {
        ...item,
        walletAddress: item.walletAddress || user.walletAddress,
      };
      if (isDuplicateActivity(itemWithWallet, prev)) {
        return prev;
      }
      const next = normalizeAndDeduplicateActivities([itemWithWallet, ...prev], user.walletAddress);
      try {
        localStorage.setItem(
          `mdefi_notifications_${user.walletAddress.toLowerCase()}`,
          JSON.stringify(next)
        );
      } catch {}
      return next;
    });
  };

  const handleMarkAllAsRead = () => {
    const updated = activities.map((a) => {
      if (!a.walletAddress || a.walletAddress.toLowerCase() === user.walletAddress.toLowerCase()) {
        return { ...a, read: true };
      }
      return a;
    });
    saveActivities(updated);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = activities.map((a) => (a.id === id ? { ...a, read: true } : a));
    saveActivities(updated);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('mdefi_user_profile', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleUpdateRewards = (newRewards: Partial<RewardBalances>) => {
    setRewards((prev) => ({ ...prev, ...newRewards }));
  };

  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimModalType, setClaimModalType] = useState<'Registration' | 'Referral' | 'Package'>('Referral');
  
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

  // Notifications state
  const [toast, setToast] = useState<{
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  id: string;
} | null>(null);
  const [rewardPopup, setRewardPopup] = useState<{ amount: number; type: string; id: string } | null>(null);

  const showToast = (
  message: string,
  type: 'success' | 'info' | 'warning' | 'error' = 'success'
) => {
    setToast({ message, type, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` });
  };

  const showRewardPopup = (amount: number, type: string, options?: { skipActivityLog?: boolean }) => {
    setRewardPopup({ amount, type, id: `reward-${Date.now()}-${Math.random().toString(36).slice(2, 9)}` });
    
    // Only add separate activity if not already logged (e.g., from claim transaction)
    if (!options?.skipActivityLog) {
      const isTeam = type.toLowerCase().includes('referral') || type.toLowerCase().includes('team') || type.toLowerCase().includes('matrix');
      const activityType: ActivityItem['type'] = isTeam ? 'Team Income' : 'Package Reward';
      const cleanType = type.toLowerCase().replace(/\s+/g, '-');
      const newActivity: ActivityItem = {
        id: `reward-credit-${cleanType}-${amount.toFixed(0)}-${Date.now()}`,
        type: activityType,
        title: isTeam ? 'Team Referral Commission Credited' : `${type} Yield Credited`,
        amount: `+${amount.toFixed(2)} MBTTC`,
        date: 'Just now',
        status: 'Confirmed',
        txHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        details: `${type} distribution of ${amount.toFixed(2)} MBTTC credited to vault`,
        walletAddress: user.walletAddress,
        read: false,
      };
      addActivity(newActivity);
    }
  };

  // Listen to Community Rating submissions across the app
  useEffect(() => {
    const handleRatingEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ rating: number; newAverage: number; totalRatings: number }>;
      const rating = customEvent.detail?.rating || 5;
      const newAverage = customEvent.detail?.newAverage || 4.8;
      showToast(`⭐ Community Rating: You submitted a ${rating}-star rating! Current Index: ${newAverage} / 5.0`, 'success');

      // Central Event Sync: Single Source of Truth
      centralEventSyncService.dispatchAction({
        actionType: 'RATING_SUBMISSION',
        txHash: `rating-${Date.now()}`,
        walletAddress: user.walletAddress,
        title: `${rating} ★ Rating`,
        details: `Your ${rating}-star rating was recorded in the MDeFi Community Reputation Index.`,
      });
    };

    window.addEventListener('mdefi:rating_submitted', handleRatingEvent);
    return () => {
      window.removeEventListener('mdefi:rating_submitted', handleRatingEvent);
    };
  }, [user.walletAddress]);

  // Listen to on-chain state refresh events (post-transaction synchronization)
  useEffect(() => {
    const unsubscribe = contractAdapter.onDataRefresh(async () => {
      try {
        const freshBalances = await mdefiService.getRewardBalances(user.walletAddress);
        setRewards(freshBalances);
        const freshProfile = await mdefiService.getUserProfile(user.walletAddress);
        setUser((prev) => ({ ...prev, ...freshProfile }));
      } catch (err) {
        console.warn('[App] Error during on-chain data refresh:', err);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user.walletAddress]);

  // Handler: Open Claim Modal
  const handleOpenClaimModal = (type: 'Registration' | 'Referral' | 'Package') => {
    setClaimModalType(type);
    setClaimModalOpen(true);
  };

  // Handler: Execute Claim
  const handleExecuteClaim = async (type: 'Registration' | 'Referral' | 'Package') => {
    try {
      // Step 4 & 5: Execute actual blockchain wallet transaction and wait for confirmation
      const res = await mdefiService.claimReward(type, user.walletAddress);

      if (res.success) {
        // Step 9: Refresh claimable amount, claimed amount and wallet-related UI from actual contract state
        const freshBalances = await mdefiService.getRewardBalances(user.walletAddress);
        setRewards(freshBalances);

        const safeClaimed = typeof res?.claimedAmount === 'number' ? res.claimedAmount : 0;
        const tx = res?.txHash || '0x0';

        // Central Event Sync: Single Source of Truth for claim events
        centralEventSyncService.dispatchAction({
          actionType: type === 'Registration' ? 'REGISTRATION_REWARD' : type === 'Referral' ? 'REFERRAL_REWARD' : 'PACKAGE_REWARD',
          txHash: tx,
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountMbttc: safeClaimed,
          details: `${type} reward pool claim of ${safeClaimed.toFixed(2)} MBTTC confirmed on BSC`,
        });

        // Step 6 & 7: ONLY AFTER SUCCESSFUL BLOCKCHAIN CONFIRMATION:
        playClaimSuccessSound();
        showToast(`Successfully claimed ${safeClaimed.toFixed(2)} MBTTC!`, 'success');
        showRewardPopup(safeClaimed, `${type} Reward`, { skipActivityLog: true });

        return res;
      } else {
        // Step failure: No success animation and no success sound
        showToast(res.message || 'Claim operation failed', 'warning');
        return res;
      }
    } catch (err: any) {
      // User rejected or wallet error: No success sound
      const errMsg = err?.message || 'Claim transaction rejected or failed';
      showToast(errMsg, 'warning');
      return { success: false, txHash: '', claimedAmount: 0, message: errMsg };
    }
  };

  // Handler: Open Package Activation Modal
  const handleOpenPackageModal = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setPackageModalOpen(true);
  };

  const handleOpenPackageModalById = (pkgId: string) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (pkg) {
      handleOpenPackageModal(pkg);
    }
  };

  // Handler: Confirm Package Activation
  const handleConfirmPackage = async (pkg: PackageItem) => {
    const res = await mdefiService.activatePackage(pkg.id);
    if (res.success) {
      // Update package list status
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? { ...p, status: 'Active', activationDate: new Date().toISOString().split('T')[0], rewardStatus: 'Accumulating Rewards' }
            : p
        )
      );

      // Central Event Sync: Single Source of Truth for package activation & matrix sync
      if (pkg.id === 'pkg-quantum' || pkg.name.toLowerCase().includes('quantum')) {
        await nexusContractService.activatePackage(1);
        centralEventSyncService.dispatchAction({
          actionType: 'QUANTUM_ACTIVATION',
          txHash: res.txHash || '0x0',
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountUsdt: 70,
          packageName: 'Quantum Node ($70)',
        });
      } else if (pkg.id === 'pkg-nexus-prime' || pkg.name.toLowerCase().includes('prime')) {
        await nexusContractService.activatePackage(2);
        centralEventSyncService.dispatchAction({
          actionType: 'NEXUS_PRIME_ACTIVATION',
          txHash: res.txHash || '0x0',
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountUsdt: 120,
          packageName: 'Nexus Prime ($120)',
        });
      } else {
        centralEventSyncService.dispatchAction({
          actionType: 'S4_ACTIVATION',
          txHash: res.txHash || '0x0',
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountUsdt: pkg.priceUSD,
          packageId: pkg.id,
          packageName: pkg.name,
        });
      }

      showToast(`Package ${pkg.name} activated successfully!`, 'success');
    } else {
      showToast(res.message || 'Activation failed', 'warning');
    }
    return res;
  };

  // Handler: Execute Token Swap (MBTTC <-> USDT)
  const handleExecuteSwap = async (params: {
    fromToken: 'MBTTC' | 'USDT';
    toToken: 'MBTTC' | 'USDT';
    fromAmount: number;
    toAmount: number;
    slippage: number;
  }) => {
    const res = await mdefiService.executeSwap(params);
    if (res.success) {
      // Update balances
      setRewards((prev) => {
        const next = { ...prev };
        if (params.fromToken === 'MBTTC') {
          next.mbttcBalance = Math.max(0, next.mbttcBalance - params.fromAmount);
          next.usdtBalance = (next.usdtBalance ?? 450) + params.toAmount;
        } else {
          next.usdtBalance = Math.max(0, (next.usdtBalance ?? 450) - params.fromAmount);
          next.mbttcBalance = next.mbttcBalance + params.toAmount;
        }
        return next;
      });

      // Central Event Sync: Single Source of Truth for DEX Swaps
      centralEventSyncService.dispatchAction({
        actionType: 'TOKEN_SWAP',
        txHash: res.txHash || '0x0',
        walletAddress: user.walletAddress,
        title: `${params.fromAmount} ${params.fromToken} → ${params.toAmount.toFixed(2)} ${params.toToken}`,
        details: `Swapped ${params.fromAmount} ${params.fromToken} for ${params.toAmount.toFixed(2)} ${params.toToken}`,
      });

      showToast(`Swapped ${params.fromAmount} ${params.fromToken} successfully!`, 'success');
    }
    return res;
  };

  // Handler: Switch Connected Wallet
  const handleSwitchWallet = async (address: string) => {
    const res = await mdefiService.switchWallet(address);
    if (res.success) {
      handleUpdateUser({ walletAddress: address });
      showToast(`Connected wallet: ${formatCompactAddress(address)}`, 'info');
    }
  };

  // Handler: Dedicated S4 Navigation (Guarded by Phase & Package Activation State)
  const handleNavigateS4 = (pkg: 'junior' | 'senior' = 'junior') => {
    const s4Access = programPhaseService.canAccessRoute('s4-matrix');
    if (!s4Access.allowed) {
      showToast(s4Access.lockMessage || 'S4 Matrix unlocks in Phase 2 community launch', 'warning');
      setCurrentPage('s4-matrix');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
      return;
    }
    const targetId = pkg === 'senior' ? 'pkg-senior' : 'pkg-junior';
    const targetPkg = packages.find(p => p.id === targetId);
    if (targetPkg && targetPkg.status !== 'Active') {
      showToast(`Please activate ${targetPkg.name} ($${targetPkg.priceUSD}) to access its matrix tree`, 'warning');
      handleOpenPackageModal(targetPkg);
      return;
    }
    setMatrixModalOpen(false);
    setS4PackageFocus(pkg);
    setCurrentPage('s4-matrix');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Handler: Dedicated Quantum Nexus Navigation ($70, Package 1) (Guarded by Phase & Package Activation State)
  const handleNavigateQuantum = () => {
    const quantumAccess = programPhaseService.canAccessRoute('quantum-nexus');
    if (!quantumAccess.allowed) {
      showToast(quantumAccess.lockMessage || 'Quantum Nexus unlocks in Phase 3 community launch', 'warning');
      setCurrentPage('quantum-nexus');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
      return;
    }
    const quantumPkg = packages.find(p => p.id === 'pkg-quantum');
    if (quantumPkg && quantumPkg.status !== 'Active') {
      showToast('Please activate Quantum Node ($70) to access its concentric matrix', 'warning');
      handleOpenPackageModal(quantumPkg);
      return;
    }
    setMatrixModalOpen(false);
    setCurrentPage('quantum-nexus');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Handler: Dedicated Nexus Prime Navigation ($120, Package 2) (Guarded by Phase & Package Activation State)
  const handleNavigateNexusPrime = () => {
    const primeAccess = programPhaseService.canAccessRoute('nexus-prime');
    if (!primeAccess.allowed) {
      showToast(primeAccess.lockMessage || 'Nexus Prime unlocks in Phase 3 community launch', 'warning');
      setCurrentPage('nexus-prime');
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch {}
      return;
    }
    const primePkg = packages.find(p => p.id === 'pkg-nexus-prime');
    if (primePkg && primePkg.status !== 'Active') {
      showToast('Please activate Nexus Prime Node ($120) to access its prime matrix', 'warning');
      handleOpenPackageModal(primePkg);
      return;
    }
    setMatrixModalOpen(false);
    setCurrentPage('nexus-prime');
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  // Handler: Backward-compatible Nexus Navigation
  const handleNavigateNexus = (pkgId: 1 | 2 = 1) => {
    if (pkgId === 2) {
      handleNavigateNexusPrime();
    } else {
      handleNavigateQuantum();
    }
  };

  const handleNavigate = (page: NavPage) => {
    const routeAccess = programPhaseService.canAccessRoute(page);
    if (!routeAccess.allowed) {
      showToast(routeAccess.lockMessage || `This module unlocks in Phase ${routeAccess.phaseRequired}`, 'warning');
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnterDashboardFromLanding = (registeredUser?: {
    userId: string;
    sponsorId: string;
    walletAddress: string;
    isNewRegistration?: boolean;
  }) => {
    if (registeredUser) {
      handleUpdateUser({
        userId: registeredUser.userId,
        sponsorId: registeredUser.sponsorId,
        walletAddress: registeredUser.walletAddress,
      });

      if (registeredUser.isNewRegistration) {
        const wallet = registeredUser.walletAddress;
        const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const regTx = `0x${randomHex}`;

        // Event Normalizer & Correlation: Correlate multi-events into 1 clean, comprehensive record
        centralEventSyncService.dispatchAction({
          actionType: 'REGISTRATION',
          txHash: regTx,
          walletAddress: wallet,
          userId: registeredUser.userId,
          sponsorId: registeredUser.sponsorId,
        });

        // Set activities from central synchronized state
        const synced = centralEventSyncService.getState().activities;
        setActivities(synced);
        try {
          localStorage.setItem(
            `mdefi_notifications_${wallet.toLowerCase()}`,
            JSON.stringify(synced)
          );
        } catch {}
      }
    }
    setAppMode('dashboard');
    showToast('Welcome to MDeFi Dashboard', 'success');
  };

  // 1. If currently in Public Website mode, display the Public Front Website
  if (appMode === 'landing') {
    return <LandingPage onEnterDashboard={handleEnterDashboardFromLanding} />;
  }

  // Route access status via centralized programPhaseService
  const routeAccess = programPhaseService.canAccessRoute(currentPage);

  // 2. Otherwise display the exact, 100% unchanged MDeFi Main Dashboard
  return (
    <div className="min-h-screen app-dashboard-root bg-[#080c09] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/25 selection:text-emerald-300">
      {/* Top Application Header */}
      <Header
        currentPage={currentPage}
        user={user}
        rewards={rewards}
        activities={activities}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onOpenClaimModal={() => handleOpenClaimModal('Referral')}
        onNavigate={handleNavigate}
        onTriggerRewardPopup={showRewardPopup}
        onReturnToLanding={() => setAppMode('landing')}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkNotificationRead}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 gap-6">
        {/* Desktop Structural Sidebar Navigation */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onNavigateS4={handleNavigateS4}
          user={user}
        />

        {/* Dynamic Page Views Container */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-0">
          {!routeAccess.allowed ? (
            <PhaseLockedView
              moduleKey={routeAccess.moduleKey}
              requiredPhase={routeAccess.phaseRequired}
              onBackToDashboard={() => handleNavigate('overview')}
              onNavigateHub={() => handleNavigate('hub')}
            />
          ) : (
            <>
              {currentPage === 'overview' && (
                <OverviewView
                  user={user}
                  rewards={rewards}
                  packages={packages}
                  activities={activities}
                  onNavigate={handleNavigate}
                  onOpenClaimModal={handleOpenClaimModal}
                  onOpenMatrixModal={() => setMatrixModalOpen(true)}
                  onTriggerRewardPopup={showRewardPopup}
                />
              )}

          {currentPage === 'mbttc' && (
            <MbttcView
              user={user}
              rewards={rewards}
              tokenStats={MBTTC_TOKEN_INFO.telemetry}
              onOpenClaimModal={handleOpenClaimModal}
              onExecuteSwap={handleExecuteSwap}
              onOpenWalletModal={() => setWalletModalOpen(true)}
            />
          )}

          {currentPage === 'team' && (
            <TeamView
              user={user}
              members={teamMembers}
              onOpenMatrixModal={() => setMatrixModalOpen(true)}
            />
          )}

          {currentPage === 'packages' && (
            <PackagesView
              packages={packages}
              userWalletAddress={user.walletAddress}
              onOpenPackageModal={handleOpenPackageModal}
              onNavigateS4={handleNavigateS4}
              onNavigateNexus={handleNavigateNexus}
              onNavigateQuantum={handleNavigateQuantum}
              onNavigateNexusPrime={handleNavigateNexusPrime}
              onResetPackages={() => {
                setPackages(mockPackages.map((p) => ({ ...p, status: 'Available' })));
                packageActivationService.resetAllowances();
                showToast('Reset packages to Available state for testing', 'info');
              }}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'quantum-nexus' && (
            <QuantumNexusView
              onBackToPackages={() => handleNavigate('packages')}
              onBackToDashboard={() => handleNavigate('overview')}
              onNavigateToNexusPrime={handleNavigateNexusPrime}
              isUserPackageActive={packages.find((p) => p.id === 'pkg-quantum')?.status === 'Active'}
              onOpenPackageModal={() => handleOpenPackageModalById('pkg-quantum')}
            />
          )}

          {currentPage === 'nexus-prime' && (
            <NexusPrimeView
              onBackToPackages={() => handleNavigate('packages')}
              onBackToDashboard={() => handleNavigate('overview')}
              onNavigateToQuantum={handleNavigateQuantum}
              isUserPackageActive={packages.find((p) => p.id === 'pkg-nexus-prime')?.status === 'Active'}
              onOpenPackageModal={() => handleOpenPackageModalById('pkg-nexus-prime')}
            />
          )}

          {currentPage === 'weekly_reward_starter' && (
            <WeeklyRewardStarterView
              user={user}
              rewards={rewards}
              onUpdateRewards={handleUpdateRewards}
              onShowToast={showToast}
              onAddActivity={addActivity}
            />
          )}

          {currentPage === 'weekly_reward_premium' && (
            <WeeklyRewardPremiumView
              user={user}
              rewards={rewards}
              onUpdateRewards={handleUpdateRewards}
              onShowToast={showToast}
              onAddActivity={addActivity}
            />
          )}

          {currentPage === 'weekly_passive_salary' && (
            <WeeklyPassiveSalaryView
              user={user}
              rewards={rewards}
              onUpdateRewards={handleUpdateRewards}
              onShowToast={showToast}
              onAddActivity={addActivity}
            />
          )}

          {currentPage === 'income' && (
            <IncomeView
              user={user}
              rewards={rewards}
              onOpenClaimModal={handleOpenClaimModal}
              onNavigate={handleNavigate}
              onNavigateS4={handleNavigateS4}
              onNavigateQuantum={handleNavigateQuantum}
              onNavigateNexusPrime={handleNavigateNexusPrime}
            />
          )}

          {currentPage === 'transactions' && (
            <TransactionsView
              activities={activities}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileView
              user={user}
              rewards={rewards}
              packages={packages}
              onUpdateUser={handleUpdateUser}
              onOpenWalletModal={() => setWalletModalOpen(true)}
              onShowToast={showToast}
            />
          )}

          {currentPage === 'hub' && (
            <HubView
              user={user}
              rewards={rewards}
              onNavigate={handleNavigate}
              onNavigateS4={handleNavigateS4}
              onNavigateQuantum={handleNavigateQuantum}
              onNavigateNexusPrime={handleNavigateNexusPrime}
            />
          )}

          {currentPage === 's4-matrix' && (
            <S4MatrixView
              initialPackage={s4PackageFocus}
              onBackToDashboard={() => handleNavigate('overview')}
              isJuniorActive={packages.find((p) => p.id === 'pkg-junior')?.status === 'Active'}
              isSeniorActive={packages.find((p) => p.id === 'pkg-senior')?.status === 'Active'}
              onOpenPackageModal={(pkg) => handleOpenPackageModalById(pkg === 'senior' ? 'pkg-senior' : 'pkg-junior')}
            />
          )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onOpenClaimModal={() => handleOpenClaimModal('Referral')}
      />

      {/* Modals Container */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        rewardType={claimModalType}
        type={claimModalType}
        amount={
          claimModalType === 'Referral'
            ? rewards.referralClaimable
            : claimModalType === 'Package'
            ? rewards.packageClaimable
            : 0
        }
        claimableAmount={
          claimModalType === 'Referral'
            ? rewards.referralClaimable
            : claimModalType === 'Package'
            ? rewards.packageClaimable
            : 0
        }
        onConfirm={handleExecuteClaim}
        onConfirmClaim={handleExecuteClaim}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        currentAddress={user.walletAddress}
        mbttcBalance={rewards.mbttcBalance}
        onSwitchAddress={handleSwitchWallet}
      />

      <MatrixModal
        isOpen={matrixModalOpen}
        onClose={() => setMatrixModalOpen(false)}
        user={user}
        onNavigateS4={handleNavigateS4}
        onNavigateQuantum={handleNavigateQuantum}
        onNavigateNexusPrime={handleNavigateNexusPrime}
      />

      <PackageModal
        isOpen={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        pkg={selectedPackage}
        walletAddress={user.walletAddress}
        onActivateConfirm={handleConfirmPackage}
        onNavigateToMatrix={(pkgId) => {
          if (pkgId.includes('junior')) handleNavigateS4('junior');
          else if (pkgId.includes('senior')) handleNavigateS4('senior');
          else if (pkgId.includes('quantum')) handleNavigateQuantum();
          else if (pkgId.includes('nexus')) handleNavigateNexusPrime();
        }}
        onOpenWalletModal={() => setWalletModalOpen(true)}
      />

      {/* Interactive Toast Notifications */}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Reward Claim Celebration Confetti & Popup */}
      {rewardPopup && (
        <RewardPopup
          key={rewardPopup.id}
          amount={rewardPopup.amount}
          type={rewardPopup.type}
          onClose={() => setRewardPopup(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

