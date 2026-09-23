import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { 
  UserProfile, 
  RewardBalances, 
  PackageItem, 
  ActivityItem, 
  TeamMember, 
  NavPage 
} from './types';
import { mdefiService } from './services/mdefiService';
import { centralEventSyncService } from './services/centralEventSyncService';
import { contractAdapter } from './services/contractAdapter';
import { nexusContractService } from './services/nexusContractService';
import { setExternalWalletProvider } from './services/contractProvider';
import { normalizeAndDeduplicateActivities, isDuplicateActivity } from './utils/notificationDeduplication';
import { formatCompactAddress } from './utils/formatAddress';
import { toHumanFacingId } from './utils/idConverter';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

import { ClaimModal } from './components/ClaimModal';
import { WalletModal } from './components/WalletModal';
import { MatrixModal } from './components/MatrixModal';
import { PackageModal } from './components/PackageModal';
import { Toast } from './components/Toast';
import { RewardPopup } from './components/RewardPopup';
import { playClaimSuccessSound } from './utils/successSound';

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

const emptyUserProfile: UserProfile = {
  walletAddress: '',
  userId: '',
  sponsorId: '',
  memberSince: '',
  directTeamCount: 0,
  totalTeamCount: 0,
  currentRank: 'Node Explorer',
  totalEarnedUsdt: 0,
  totalEarnedMbttc: 0,
};

const emptyRewardBalances: RewardBalances = {
  mbttcBalance: 0,
  usdtBalance: 0,
  referralEarned: 0,
  referralClaimed: 0,
  referralClaimable: 0,
  packageEarned: 0,
  packageClaimed: 0,
  packageClaimable: 0,
  lastReferralClaim: 'Never',
  lastPackageClaim: 'Never',
  nextReferralClaimSec: 0,
  nextPackageClaimSec: 0,
};

function MainApp() {
  const [appMode, setAppMode] = useState<'landing' | 'dashboard'>(() => {
    try {
      const savedMode = localStorage.getItem('mdefi_app_mode');
      return savedMode === 'dashboard' ? 'dashboard' : 'landing';
    } catch {
      return 'landing';
    }
  });
  const [isVerifyingOnChain, setIsVerifyingOnChain] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [s4PackageFocus, setS4PackageFocus] = useState<'junior' | 'senior'>('junior');

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mdefi_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return emptyUserProfile;
  });

  const [rewards, setRewards] = useState<RewardBalances>(emptyRewardBalances);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const userRef = useRef<UserProfile>(user);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const loadActivitiesForWallet = (walletAddress: string): ActivityItem[] => {
    if (!walletAddress) return [];
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
    return [];
  };

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    return loadActivitiesForWallet(user.walletAddress);
  });

  const persistAppMode = (mode: 'landing' | 'dashboard') => {
    setAppMode(mode);
    try {
      localStorage.setItem('mdefi_app_mode', mode);
    } catch {}
  };

  const persistUserProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      localStorage.setItem('mdefi_user_profile', JSON.stringify(updatedUser));
    } catch {}
  };

  // Live on-chain sync
  const syncLiveOnChainUser = useCallback(async (walletAddress: string, verifiedNode?: any) => {
    if (!walletAddress || !ethers.isAddress(walletAddress)) return;

    try {
      const node = verifiedNode || (await contractAdapter.getHubUserNode(walletAddress));
      if (!node || !node.isRegistered) return;

      const dashboard: any = await contractAdapter.getHubUserData(walletAddress);
      const rawNumericId = Number(node.id || 0);
      const userFacingId = rawNumericId > 0 ? toHumanFacingId(rawNumericId) : `MDF-${rawNumericId}`;
      const sponsorAddress = node.upline || dashboard?.sponsorId || '';

      const updatedProfile: UserProfile = {
        walletAddress: node.wallet || walletAddress,
        userId: userFacingId,
        sponsorId: sponsorAddress,
        memberSince: dashboard?.registrationTimestamp 
          ? new Date(dashboard.registrationTimestamp).toLocaleDateString()
          : 'Active Node',
        directTeamCount: Number(node.directTeam?.length ?? dashboard?.directTeamCount ?? 0),
        totalTeamCount: Number(node.totalTeam ?? dashboard?.totalTeamCount ?? 0),
        currentRank: 'Node Explorer',
        totalEarnedUsdt: parseFloat(dashboard?.referralTotalEarned || '0') + parseFloat(dashboard?.packageTotalEarned || '0'),
        totalEarnedMbttc: 0,
      };

      persistUserProfile(updatedProfile);

      const freshBalances = await mdefiService.getRewardBalances(walletAddress);
      setRewards(freshBalances);

      const ids = await contractAdapter.getConfiguredPackageIds();
      const loadedPackages: PackageItem[] = await Promise.all(
        ids.map(async (pId) => {
          const details = await contractAdapter.getHubPackageDetails(pId);
          const isActive = await contractAdapter.isUserPackageActive(walletAddress, pId);
          return {
            id: `pkg-${pId}`,
            numericId: pId,
            name: details?.name || `Package #${pId}`,
            priceUSD: details?.humanAmount || 0,
            status: (isActive ? 'Active' : 'Available') as 'Active' | 'Available',
            rewardStatus: isActive ? 'Accumulating Rewards' : 'Pending Activation',
            activationDate: isActive ? 'Active On-Chain' : undefined,
          } as unknown as PackageItem;
        })
      );
      setPackages(loadedPackages);
    } catch (error) {
      console.error('[App] Failed to sync live on-chain profile:', error);
    }
  }, []);

  const verifyWalletRegistration = useCallback(async (walletAddress: string): Promise<{
    registered: boolean;
    node: any | null;
  }> => {
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return { registered: false, node: null };
    }

    try {
      const node = await contractAdapter.getHubUserNode(walletAddress);
      if (!node) {
        return { registered: false, node: null };
      }

      const numericId = Number(node.id || 0);

      if (numericId === 1) {
        return { registered: true, node };
      }

      const isRegistered = Boolean(node.isRegistered);
      if (isRegistered || numericId > 0) {
        return { registered: true, node };
      }

      return { registered: false, node };
    } catch (error) {
      console.error('[App] On-chain registration verification failed:', error);
      return { registered: false, node: null };
    }
  }, []);

  // SINGLE UNIFIED INJECTED WALLET AND DAPP AUTO-SYNC
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    const activeProvider = w.ethereum || w.trustwallet?.ethereum || w.tokenpocket?.ethereum || w.bitkeep?.ethereum || w.bitget?.ethereum;

    if (!activeProvider || typeof activeProvider.request !== 'function') {
      // If not in injected DApp browser, verify cached user if in dashboard
      if (appMode === 'dashboard' && userRef.current.walletAddress) {
        verifyWalletRegistration(userRef.current.walletAddress).then(({ registered, node }) => {
          if (registered && node) {
            syncLiveOnChainUser(userRef.current.walletAddress, node);
          } else {
            persistAppMode('landing');
          }
        });
      }
      return;
    }

    // Set provider globally immediately
    setExternalWalletProvider(activeProvider);

    const checkAndSyncAccount = async () => {
      try {
        const accounts = (await activeProvider.request({ method: 'eth_accounts' })) as string[];
        if (Array.isArray(accounts) && accounts[0] && ethers.isAddress(accounts[0])) {
          const liveAddr = accounts[0];
          const currentStored = userRef.current.walletAddress;

          // If address changed or not set, force refresh state
          if (!currentStored || currentStored.toLowerCase() !== liveAddr.toLowerCase()) {
            const { registered, node } = await verifyWalletRegistration(liveAddr);
            if (registered && node) {
              await syncLiveOnChainUser(liveAddr, node);
              persistAppMode('dashboard');
            } else {
              persistUserProfile({ ...emptyUserProfile, walletAddress: liveAddr });
              persistAppMode('landing');
            }
          } else if (appMode === 'dashboard') {
            // Address matches, verify node status
            const { registered, node } = await verifyWalletRegistration(liveAddr);
            if (registered && node) {
              await syncLiveOnChainUser(liveAddr, node);
            } else {
              persistAppMode('landing');
            }
          }
        } else if (appMode === 'dashboard' && userRef.current.walletAddress) {
          // Injected wallet locked
          persistAppMode('landing');
        }
      } catch (err) {
        console.warn('[App] Injected wallet auto-sync error:', err);
      }
    };

    checkAndSyncAccount();

    const handleAccountsChanged = async (accounts: unknown) => {
      const accs = accounts as string[];
      if (Array.isArray(accs) && accs.length > 0 && ethers.isAddress(accs[0])) {
        const newAddr = accs[0];
        const { registered, node } = await verifyWalletRegistration(newAddr);
        if (registered && node) {
          await syncLiveOnChainUser(newAddr, node);
          persistAppMode('dashboard');
        } else {
          persistUserProfile({ ...emptyUserProfile, walletAddress: newAddr });
          persistAppMode('landing');
        }
      } else {
        persistUserProfile(emptyUserProfile);
        persistAppMode('landing');
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    if (activeProvider.on) {
      activeProvider.on('accountsChanged', handleAccountsChanged);
      activeProvider.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (activeProvider.removeListener) {
        activeProvider.removeListener('accountsChanged', handleAccountsChanged);
        activeProvider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []); // Run once on mount safely, handles live events internally

  useEffect(() => {
    if (!user.walletAddress) return;
    setActivities(loadActivitiesForWallet(user.walletAddress));

    const unsubscribe = centralEventSyncService.subscribe((syncState) => {
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

      setTeamMembers(syncState.teamMembers);
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
    const updated = activities.map((a) => ({ ...a, read: true }));
    saveActivities(updated);
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = activities.map((a) => (a.id === id ? { ...a, read: true } : a));
    saveActivities(updated);
  };

  const handleUpdateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => {
      const next = { ...prev, ...updated };
      persistUserProfile(next);
      return next;
    });
  };

  const handleUpdateRewards = (newRewards: Partial<RewardBalances>) => {
    setRewards((prev) => ({ ...prev, ...newRewards }));
  };

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimModalType, setClaimModalType] = useState<'Registration' | 'Referral' | 'Package'>('Referral');
  
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [matrixModalOpen, setMatrixModalOpen] = useState(false);
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);

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
        txHash: '',
        details: `${type} distribution of ${amount.toFixed(2)} MBTTC credited to vault`,
        walletAddress: user.walletAddress,
        read: false,
      };
      addActivity(newActivity);
    }
  };

  useEffect(() => {
    const unsubscribe = contractAdapter.onDataRefresh(async () => {
      if (!user.walletAddress) return;
      try {
        const freshBalances = await mdefiService.getRewardBalances(user.walletAddress);
        setRewards(freshBalances);
        await syncLiveOnChainUser(user.walletAddress);
      } catch (err) {
        console.warn('[App] Error during on-chain data refresh:', err);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user.walletAddress, syncLiveOnChainUser]);

  const handleOpenClaimModal = (type: 'Registration' | 'Referral' | 'Package') => {
    setClaimModalType(type);
    setClaimModalOpen(true);
  };

  const handleExecuteClaim = async (type: 'Registration' | 'Referral' | 'Package') => {
    try {
      const res = await mdefiService.claimReward(type, user.walletAddress);

      if (res.success) {
        const freshBalances = await mdefiService.getRewardBalances(user.walletAddress);
        setRewards(freshBalances);

        const safeClaimed = typeof res?.claimedAmount === 'number' ? res.claimedAmount : 0;
        const tx = res?.txHash || '';

        centralEventSyncService.dispatchAction({
          actionType: type === 'Registration' ? 'REGISTRATION_REWARD' : type === 'Referral' ? 'REFERRAL_REWARD' : 'PACKAGE_REWARD',
          txHash: tx,
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountMbttc: safeClaimed,
          details: `${type} reward pool claim of ${safeClaimed.toFixed(2)} MBTTC confirmed on BSC`,
        });

        playClaimSuccessSound();
        showToast(`Successfully claimed ${safeClaimed.toFixed(2)} MBTTC!`, 'success');
        showRewardPopup(safeClaimed, `${type} Reward`, { skipActivityLog: true });

        return res;
      } else {
        showToast(res.message || 'Claim operation failed', 'warning');
        return res;
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Claim transaction rejected or failed';
      showToast(errMsg, 'warning');
      return { success: false, txHash: '', claimedAmount: 0, message: errMsg };
    }
  };

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

  const handleConfirmPackage = async (pkg: PackageItem) => {
    const res = await mdefiService.activatePackage(pkg.id);
    if (res.success) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === pkg.id
            ? { ...p, status: 'Active', activationDate: new Date().toISOString().split('T')[0], rewardStatus: 'Accumulating Rewards' }
            : p
        )
      );

      if (pkg.id === 'pkg-quantum' || pkg.name.toLowerCase().includes('quantum')) {
        await nexusContractService.activatePackage(1);
        centralEventSyncService.dispatchAction({
          actionType: 'QUANTUM_ACTIVATION',
          txHash: res.txHash || '',
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountUsdt: 70,
          packageName: 'Quantum Node ($70)',
        });
      } else if (pkg.id === 'pkg-nexus-prime' || pkg.name.toLowerCase().includes('prime')) {
        await nexusContractService.activatePackage(2);
        centralEventSyncService.dispatchAction({
          actionType: 'NEXUS_PRIME_ACTIVATION',
          txHash: res.txHash || '',
          walletAddress: user.walletAddress,
          userId: user.userId,
          amountUsdt: 120,
          packageName: 'Nexus Prime ($120)',
        });
      } else {
        centralEventSyncService.dispatchAction({
          actionType: 'S4_ACTIVATION',
          txHash: res.txHash || '',
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

  const handleExecuteSwap = async (params: {
    fromToken: 'MBTTC' | 'USDT';
    toToken: 'MBTTC' | 'USDT';
    fromAmount: number;
    toAmount: number;
    slippage: number;
  }) => {
    const res = await mdefiService.executeSwap(params);
    if (res.success) {
      setRewards((prev) => {
        const next = { ...prev };
        if (params.fromToken === 'MBTTC') {
          next.mbttcBalance = Math.max(0, next.mbttcBalance - params.fromAmount);
          next.usdtBalance = (next.usdtBalance ?? 0) + params.toAmount;
        } else {
          next.usdtBalance = Math.max(0, (next.usdtBalance ?? 0) - params.fromAmount);
          next.mbttcBalance = next.mbttcBalance + params.toAmount;
        }
        return next;
      });

      centralEventSyncService.dispatchAction({
        actionType: 'TOKEN_SWAP',
        txHash: res.txHash || '',
        walletAddress: user.walletAddress,
        title: `${params.fromAmount} ${params.fromToken} → ${params.toAmount.toFixed(2)} ${params.toToken}`,
        details: `Swapped ${params.fromAmount} ${params.fromToken} for ${params.toAmount.toFixed(2)} ${params.toToken}`,
      });

      showToast(`Swapped ${params.fromAmount} ${params.fromToken} successfully!`, 'success');
    }
    return res;
  };

  const handleSwitchWallet = async (address: string) => {
    if (!address || !ethers.isAddress(address)) {
      showToast('Invalid wallet address.', 'error');
      return;
    }

    showToast('Verifying wallet registration status...', 'info');
    const { registered, node } = await verifyWalletRegistration(address);

    if (!registered || !node) {
      showToast('This wallet is not registered. Please complete registration first.', 'error');
      return;
    }

    if (node.isBlocked) {
      showToast('This wallet is blocked. Switch rejected.', 'error');
      return;
    }

    const res = await mdefiService.switchWallet(address);
    if (res.success) {
      await syncLiveOnChainUser(address, node);
      showToast(`Connected wallet: ${formatCompactAddress(address)}`, 'info');
    }
  };

  const handleNavigateS4 = (pkg: 'junior' | 'senior' = 'junior') => {
    const s4Access = programPhaseService.canAccessRoute('s4-matrix');
    if (!s4Access.allowed) {
      showToast(s4Access.lockMessage || 'S4 Matrix unlocks in Phase 2 community launch', 'warning');
      setCurrentPage('s4-matrix');
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
  };

  const handleNavigateQuantum = () => {
    const quantumAccess = programPhaseService.canAccessRoute('quantum-nexus');
    if (!quantumAccess.allowed) {
      showToast(quantumAccess.lockMessage || 'Quantum Nexus unlocks in Phase 3 community launch', 'warning');
      setCurrentPage('quantum-nexus');
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
  };

  const handleNavigateNexusPrime = () => {
    const primeAccess = programPhaseService.canAccessRoute('nexus-prime');
    if (!primeAccess.allowed) {
      showToast(primeAccess.lockMessage || 'Nexus Prime unlocks in Phase 3 community launch', 'warning');
      setCurrentPage('nexus-prime');
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
  };

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

  const handleEnterDashboardFromLanding = async (registeredUser?: {
    userId: string;
    sponsorId: string;
    walletAddress: string;
    isNewRegistration?: boolean;
    txHash?: string;
  }) => {
    const targetAddress = registeredUser?.walletAddress || user.walletAddress;

    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      showToast('Please connect wallet first to access the dashboard.', 'warning');
      return;
    }

    setIsVerifyingOnChain(true);

    try {
      let verification = await verifyWalletRegistration(targetAddress);
      if (!verification.registered && registeredUser?.isNewRegistration) {
        await new Promise((r) => setTimeout(r, 2000));
        verification = await verifyWalletRegistration(targetAddress);
      }

      if (!verification.registered || !verification.node) {
        showToast('Please complete registration first to access the dashboard.', 'warning');
        setIsVerifyingOnChain(false);
        return;
      }

      if (verification.node.isBlocked) {
        showToast('This account is blocked by the contract. Dashboard access restricted.', 'error');
        setIsVerifyingOnChain(false);
        persistAppMode('landing');
        return;
      }

      await syncLiveOnChainUser(targetAddress, verification.node);

      if (registeredUser?.isNewRegistration) {
        centralEventSyncService.dispatchAction({
          actionType: 'REGISTRATION',
          txHash: registeredUser.txHash || '',
          walletAddress: targetAddress,
          userId: toHumanFacingId(verification.node.id),
          sponsorId: verification.node.upline,
        });

        const synced = centralEventSyncService.getState().activities;
        setActivities(synced);
        try {
          localStorage.setItem(
            `mdefi_notifications_${targetAddress.toLowerCase()}`,
            JSON.stringify(synced)
          );
        } catch {}
      }

      persistAppMode('dashboard');
      showToast('Registration verified! Welcome to MDeFi Dashboard.', 'success');
    } catch (err) {
      console.error('[App] Verification error:', err);
      showToast('Blockchain verification timeout. Please try again.', 'warning');
    } finally {
      setIsVerifyingOnChain(false);
    }
  };

  if (appMode === 'landing') {
    return (
      <>
        <LandingPage onEnterDashboard={handleEnterDashboardFromLanding} />
        {isVerifyingOnChain && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative flex flex-col items-center p-8 rounded-3xl bg-[#09150f] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.25)] space-y-4 text-center max-w-sm w-full">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 border-r-teal-300 animate-spin"></div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  Verifying On-Chain Status
                </h4>
                <p className="text-xs text-emerald-400/80 font-mono">
                  Syncing with BNB Smart Chain...
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const routeAccess = programPhaseService.canAccessRoute(currentPage);

  return (
    <div className="min-h-screen app-dashboard-root bg-[#080c09] text-zinc-100 flex flex-col antialiased selection:bg-emerald-500/25 selection:text-emerald-300">
      <Header
        currentPage={currentPage}
        user={user}
        rewards={rewards}
        activities={activities}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onOpenClaimModal={() => handleOpenClaimModal('Referral')}
        onNavigate={handleNavigate}
        onTriggerRewardPopup={showRewardPopup}
        onReturnToLanding={() => persistAppMode('landing')}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkNotificationRead}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 gap-6">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onNavigateS4={handleNavigateS4}
          user={user}
        />

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
                  onResetPackages={() => {}}
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

      <MobileNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={user}
        onOpenClaimModal={() => handleOpenClaimModal('Referral')}
      />

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
        onWalletConnected={(addr) => handleSwitchWallet(addr)}
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

      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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