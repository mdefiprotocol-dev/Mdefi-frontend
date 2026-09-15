import { 
  WeeklyStarterData, 
  WeeklyStarterClaimRecord, 
  WeeklyPremiumData, 
  WeeklyPremiumClaimRecord, 
  WeeklySalaryData, 
  WeeklySalaryClaimRecord, 
  WeeklySalaryRankItem, 
  RankHistoryRecord,
  ClaimChartPoint,
  PassiveSalaryRankName,
  SmartContractTimerInfo
} from '../types/rewards';

class RewardDashboardsService {
  private starterClaimHistory: WeeklyStarterClaimRecord[] = [
    {
      id: 'st-tx-01',
      week: 13,
      directPartners: 12,
      shares: 12,
      rewardUsdt: 175.50,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-08-30',
      txHash: '0x8f3c884a1e9e7b3c2a1d0f5e4b7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    },
    {
      id: 'st-tx-02',
      week: 12,
      directPartners: 11,
      shares: 11,
      rewardUsdt: 160.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-08-23',
      txHash: '0x7e2b773f0d8d6a2b1f0e9d4c3a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    },
    {
      id: 'st-tx-03',
      week: 11,
      directPartners: 10,
      shares: 10,
      rewardUsdt: 152.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-08-16',
      txHash: '0x6d1a662e9c7c5f1a0e9d8c3b2a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    },
    {
      id: 'st-tx-04',
      week: 10,
      directPartners: 9,
      shares: 9,
      rewardUsdt: 140.50,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-08-09',
      txHash: '0x5c0f551d8b6b4e0f9d8c7b2a1a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    },
    {
      id: 'st-tx-05',
      week: 9,
      directPartners: 8,
      shares: 8,
      rewardUsdt: 125.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-08-02',
      txHash: '0x4b9e440c7a5a3d9e8c7b6a1f0a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    },
    {
      id: 'st-tx-06',
      week: 8,
      directPartners: 7,
      shares: 7,
      rewardUsdt: 110.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-07-26',
      txHash: '0x3a8d339b69492c8d7b6a5f0e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    },
    {
      id: 'st-tx-07',
      week: 7,
      directPartners: 6,
      shares: 6,
      rewardUsdt: 95.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-07-19',
      txHash: '0x297c228a58381b7c6a5f4e0d8e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    },
    {
      id: 'st-tx-08',
      week: 6,
      directPartners: 5,
      shares: 5,
      rewardUsdt: 80.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      claimDate: '2026-07-12',
      txHash: '0x186b117947270a6b594e3d0c7d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    },
  ];

  private premiumClaimHistory: WeeklyPremiumClaimRecord[] = [
    {
      id: 'pr-tx-01',
      week: 13,
      directPartners: 12,
      shares: 12,
      rewardUsdt: 330.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-08-30',
      txHash: '0x4b9e440c7a5a3d9e8c7b6a1f0a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    },
    {
      id: 'pr-tx-02',
      week: 12,
      directPartners: 11,
      shares: 11,
      rewardUsdt: 310.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-08-23',
      txHash: '0x3a8d339b69492c8d7b6a5f0e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    },
    {
      id: 'pr-tx-03',
      week: 11,
      directPartners: 10,
      shares: 10,
      rewardUsdt: 295.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-08-16',
      txHash: '0x297c228a58381b7c6a5f4e0d8e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    },
    {
      id: 'pr-tx-04',
      week: 10,
      directPartners: 9,
      shares: 9,
      rewardUsdt: 275.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-08-09',
      txHash: '0x186b117947270a6b594e3d0c7d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    },
    {
      id: 'pr-tx-05',
      week: 9,
      directPartners: 8,
      shares: 8,
      rewardUsdt: 250.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-08-02',
      txHash: '0x075a00683616f95a483d2c0b6c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    },
    {
      id: 'pr-tx-06',
      week: 8,
      directPartners: 7,
      shares: 7,
      rewardUsdt: 220.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-07-26',
      txHash: '0xf649ff572505e849372c1b0a5b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
    },
    {
      id: 'pr-tx-07',
      week: 7,
      directPartners: 6,
      shares: 6,
      rewardUsdt: 190.00,
      claimFeeMbttc: 10.00,
      status: 'Confirmed',
      claimDate: '2026-07-19',
      txHash: '0xe538ee461404d738261b0a9f4a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    },
  ];

  private salaryClaimHistory: WeeklySalaryClaimRecord[] = [
    {
      id: 'sal-tx-01',
      claimDate: '2026-08-24',
      weeksClaimed: 2,
      weekNumbers: 'W11 & W12',
      salaryAmountUsdt: 30.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0x186b117947270a6b594e3d0c7d0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    },
    {
      id: 'sal-tx-02',
      claimDate: '2026-08-10',
      weeksClaimed: 1,
      weekNumbers: 'Week 10',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0x075a00683616f95a483d2c0b6c9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    },
    {
      id: 'sal-tx-03',
      claimDate: '2026-08-03',
      weeksClaimed: 1,
      weekNumbers: 'Week 9',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0xf649ff572505e849372c1b0a5b8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
    },
    {
      id: 'sal-tx-04',
      claimDate: '2026-07-27',
      weeksClaimed: 1,
      weekNumbers: 'Week 8',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0xe538ee461404d738261b0a9f4a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    },
    {
      id: 'sal-tx-05',
      claimDate: '2026-07-20',
      weeksClaimed: 1,
      weekNumbers: 'Week 7',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0xd427dd350393c627150a998e396c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
    },
    {
      id: 'sal-tx-06',
      claimDate: '2026-07-13',
      weeksClaimed: 1,
      weekNumbers: 'Week 6',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0xc316cc249282b5160499887d285b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    },
    {
      id: 'sal-tx-07',
      claimDate: '2026-07-06',
      weeksClaimed: 1,
      weekNumbers: 'Week 5',
      salaryAmountUsdt: 15.00,
      claimFeeMbttc: 5.00,
      status: 'Confirmed',
      txHash: '0xb205bb138171a4059388776c174a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    },
  ];

  private rankHistory: RankHistoryRecord[] = [
    { id: 'rh-01', rank: 'Bronze', date: '2026-07-15', week: 2, status: 'Active' },
  ];

  // =========================================================================
  // 3 SEPARATE SMART CONTRACTS (Architecture for Production & Demo Testing)
  // Each module has its own independent contract timer and claim status.
  // =========================================================================
  public readonly starterContractTimer: SmartContractTimerInfo = {
    contractAddress: '0x7a250d5630B4cF539739dF2C5dAcB4c659F2488D',
    contractName: 'WeeklyStarterRewardDistributorV1',
    network: 'Binance Smart Chain (BSC BEP-20)',
    epochCycleSeconds: 7 * 86400,
    remainingSeconds: 2 * 86400 + 14 * 3600 + 32 * 60 + 15, // Independent Starter contract timer
    isClaimWindowOpen: true, // Demo testing mode: Claim button enabled
    demoTestingMode: true,
  };

  public readonly premiumContractTimer: SmartContractTimerInfo = {
    contractAddress: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    contractName: 'WeeklyPremiumRewardVaultV1',
    network: 'Binance Smart Chain (BSC BEP-20)',
    epochCycleSeconds: 7 * 86400,
    remainingSeconds: 3 * 86400 + 8 * 3600 + 15 * 60 + 40, // Independent Premium contract timer
    isClaimWindowOpen: true, // Demo testing mode: Claim button enabled
    demoTestingMode: true,
  };

  public readonly salaryContractTimer: SmartContractTimerInfo = {
    contractAddress: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    contractName: 'WeeklyPassiveSalaryDistributorV1',
    network: 'Binance Smart Chain (BSC BEP-20)',
    epochCycleSeconds: 7 * 86400,
    remainingSeconds: 1 * 86400 + 19 * 3600 + 44 * 60 + 25, // Independent Passive Salary contract timer
    isClaimWindowOpen: true, // Demo testing mode: Claim button enabled
    demoTestingMode: true,
  };

  // In-session demo claim tracking (resets on page refresh so Claim is immediately available again for testing)
  private sessionClaimedStarter: boolean = false;
  private sessionClaimedPremium: boolean = false;
  private sessionClaimedSalary: boolean = false;

  constructor() {
    this.loadHistoryFromStorage();
  }

  private getNumberStorage(key: string, fallback: number): number {
    if (typeof window === 'undefined') return fallback;
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return fallback;
      const num = parseFloat(val);
      return isNaN(num) ? fallback : num;
    } catch {
      return fallback;
    }
  }

  private setStorage(key: string, value: any): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  private loadHistoryFromStorage(): void {
    if (typeof window === 'undefined') return;
    try {
      // Clean up any legacy permanently saved demo claimable 0.00 states
      // so refreshing the page ALWAYS restores Claim availability for testing
      localStorage.removeItem('mdefi_starter_claimable');
      localStorage.removeItem('mdefi_premium_claimable');
      localStorage.removeItem('mdefi_salary_claimable');
      localStorage.removeItem('mdefi_salary_pending');
      localStorage.removeItem('mdefi_salary_pending_weeks');

      const st = localStorage.getItem('mdefi_starter_history');
      if (st) this.starterClaimHistory = JSON.parse(st);
      const pr = localStorage.getItem('mdefi_premium_history');
      if (pr) this.premiumClaimHistory = JSON.parse(pr);
      const sal = localStorage.getItem('mdefi_salary_history');
      if (sal) this.salaryClaimHistory = JSON.parse(sal);
    } catch {
      // ignore
    }
  }

  // Contract timer helper queries
  async getStarterContractTimer(): Promise<SmartContractTimerInfo> {
    return { ...this.starterContractTimer };
  }

  async getPremiumContractTimer(): Promise<SmartContractTimerInfo> {
    return { ...this.premiumContractTimer };
  }

  async getSalaryContractTimer(): Promise<SmartContractTimerInfo> {
    return { ...this.salaryContractTimer };
  }

  // 1. WEEKLY STARTER DATA
  // Rule: Required directs: 2. Every direct partner gives exactly 1 share!
  // User has 12 directs -> 12 shares, 100% qualified!
  async getStarterData(): Promise<WeeklyStarterData> {
    const totalClaimed = this.getNumberStorage('mdefi_starter_total_settled', 1240.00);
    // DEMO/TESTING MODE: claimable is available on page refresh. In active session, resets after claim.
    const claimable = this.sessionClaimedStarter ? 0.00 : 185.00;

    return {
      currentWeek: 14,
      status: 'Active',
      remainingSeconds: this.starterContractTimer.remainingSeconds,
      directPartners: 12,
      requiredDirectPartners: 2,
      isQualified: true,
      allocatedShares: 12, // 1 share per direct partner
      qualificationProgressPercent: 100,
      totalWeeklyShares: 1420,
      currentPoolUsdt: 52500,
      weeklyDepositsUsdt: 14800,
      poolStatus: 'Accumulating Rewards',
      estimatedRewardUsdt: 185.00,
      claimableRewardUsdt: claimable,
      totalRewardEarnedUsdt: 1425.00,
      totalRewardClaimedUsdt: totalClaimed,
      claimFeeMbttc: 5.00, // MBTTC is used ONLY as the claim fee token
      lastClaimWeek: 13,
      lastClaimDate: '7 days ago',
      contractAddress: this.starterContractTimer.contractAddress,
      contractName: this.starterContractTimer.contractName,
      isClaimAvailable: !this.sessionClaimedStarter && this.starterContractTimer.isClaimWindowOpen,
    };
  }

  async getStarterClaimHistory(): Promise<WeeklyStarterClaimRecord[]> {
    return [...this.starterClaimHistory];
  }

  async claimStarterReward(): Promise<{ success: boolean; txHash: string; claimedAmountUsdt: number; totalSettledUsdt: number; claimFeeMbttc: number; message?: string }> {
    await new Promise((r) => setTimeout(r, 1200));
    const previousTotal = this.getNumberStorage('mdefi_starter_total_settled', 1240.00);
    const claimedUsdt = 185.00;
    const newTotalSettled = previousTotal + claimedUsdt;
    const fee = 5.00;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    this.sessionClaimedStarter = true;
    this.setStorage('mdefi_starter_total_settled', newTotalSettled.toFixed(2));
    // Note: Do NOT permanently save 0.00 to localStorage in demo mode

    const newRecord: WeeklyStarterClaimRecord = {
      id: `st-tx-${Date.now()}`,
      week: 14,
      directPartners: 12,
      shares: 12,
      rewardUsdt: claimedUsdt,
      claimFeeMbttc: fee,
      status: 'Confirmed',
      claimDate: new Date().toISOString().split('T')[0],
      txHash,
    };
    this.starterClaimHistory.unshift(newRecord);
    this.setStorage('mdefi_starter_history', this.starterClaimHistory);

    return {
      success: true,
      txHash,
      claimedAmountUsdt: claimedUsdt,
      totalSettledUsdt: newTotalSettled,
      claimFeeMbttc: fee,
      message: 'Weekly Reward Starter claimed successfully on-chain.',
    };
  }

  // 2. WEEKLY PREMIUM DATA
  // Rule: Required directs: 3. Every direct partner gives exactly 1 share!
  // User has 12 directs -> 12 shares, 100% qualified!
  async getPremiumData(): Promise<WeeklyPremiumData> {
    const totalClaimed = this.getNumberStorage('mdefi_premium_total_settled', 3510.00);
    // DEMO/TESTING MODE: claimable is available on page refresh. In active session, resets after claim.
    const claimable = this.sessionClaimedPremium ? 0.00 : 340.00;
    const claimsCount = this.getNumberStorage('mdefi_premium_claims_count', 11);

    return {
      currentWeek: 14,
      status: 'Active',
      remainingSeconds: this.premiumContractTimer.remainingSeconds,
      directPartners: 12,
      requiredDirectPartners: 3,
      isQualified: true,
      allocatedShares: 12, // 1 share per direct partner
      qualificationProgressPercent: 100,
      totalWeeklyShares: 840,
      userSharePercentage: Number(((12 / 840) * 100).toFixed(2)), // 1.43% of total shares
      currentPoolUsdt: 145000,
      weeklyDepositsUsdt: 38500,
      poolStatus: 'Contract Vault Active',
      estimatedRewardUsdt: 340.00,
      claimableRewardUsdt: claimable,
      totalRewardEarnedUsdt: 3850.00,
      totalRewardClaimedUsdt: totalClaimed,
      totalClaimsCount: claimsCount,
      claimFeeMbttc: 10.00, // MBTTC is used ONLY as the claim fee token
      lastClaimDate: '7 days ago',
      contractAddress: this.premiumContractTimer.contractAddress,
      contractName: this.premiumContractTimer.contractName,
      isClaimAvailable: !this.sessionClaimedPremium && this.premiumContractTimer.isClaimWindowOpen,
    };
  }

  async getPremiumClaimHistory(): Promise<WeeklyPremiumClaimRecord[]> {
    return [...this.premiumClaimHistory];
  }

  async claimPremiumReward(): Promise<{ success: boolean; txHash: string; claimedAmountUsdt: number; totalSettledUsdt: number; claimFeeMbttc: number; message?: string }> {
    await new Promise((r) => setTimeout(r, 1300));
    const previousTotal = this.getNumberStorage('mdefi_premium_total_settled', 3510.00);
    const claimedUsdt = 340.00;
    const newTotalSettled = previousTotal + claimedUsdt;
    const claimsCount = this.getNumberStorage('mdefi_premium_claims_count', 11) + 1;
    const fee = 10.00;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    this.sessionClaimedPremium = true;
    this.setStorage('mdefi_premium_total_settled', newTotalSettled.toFixed(2));
    this.setStorage('mdefi_premium_claims_count', claimsCount.toString());
    // Note: Do NOT permanently save 0.00 to localStorage in demo mode

    const newRecord: WeeklyPremiumClaimRecord = {
      id: `pr-tx-${Date.now()}`,
      week: 14,
      directPartners: 12,
      shares: 12,
      rewardUsdt: claimedUsdt,
      claimFeeMbttc: fee,
      status: 'Confirmed',
      claimDate: new Date().toISOString().split('T')[0],
      txHash,
    };
    this.premiumClaimHistory.unshift(newRecord);
    this.setStorage('mdefi_premium_history', this.premiumClaimHistory);

    return {
      success: true,
      txHash,
      claimedAmountUsdt: claimedUsdt,
      totalSettledUsdt: newTotalSettled,
      claimFeeMbttc: fee,
      message: 'Weekly Reward Premium claimed successfully on-chain.',
    };
  }

  // 3. WEEKLY PASSIVE SALARY DATA
  // All salary amounts in USDT!
  // Final Schedule:
  // Bronze: 10 directs, $15/wk, 10 wks (Total $150)
  // Silver: 25 directs (+15), $30/wk, 11 wks (Total $330)
  // Gold: 50 directs (+25), $50/wk, 12 wks (Total $600)
  // Platinum: 100 directs (+50), $100/wk, 12 wks (Total $1,200)
  // Diamond: 250 directs (+150), $250/wk, 13 wks (Total $3,250)
  // Blue Diamond: 500 directs (+250), $500/wk, 12 wks (Total $6,000)
  // Crown Diamond: 1,000 directs (+500), $1,000/wk, 12 wks (Total $12,000)
  // Total cumulative potential across all 7 ranks = $23,530 USDT
  // Current user has 12 directs -> Bronze Tier 1 (10 required, qualified), working toward Silver (25 required, 48% progress).
  async getSalaryData(): Promise<WeeklySalaryData> {
    const totalClaimed = this.getNumberStorage('mdefi_salary_total_settled', 120.00);
    // DEMO/TESTING MODE: claimable and pending amounts reset on page refresh
    const claimable = this.sessionClaimedSalary ? 0.00 : 30.00;
    const pending = this.sessionClaimedSalary ? 0.00 : 30.00;
    const pendingWeeks = this.sessionClaimedSalary ? 0 : 2;
    const claimsCount = this.getNumberStorage('mdefi_salary_claims_count', 8);

    return {
      currentRankLevel: 1,
      currentRankName: 'Bronze',
      directPartners: 12,
      requiredDirectPartnersForCurrent: 10,
      weeklySalaryUsdt: 15.00, // In USDT
      pendingSalaryUsdt: pending, // In USDT (2 accumulated weeks @ $15)
      pendingWeeks: pendingWeeks,
      claimableSalaryUsdt: claimable, // In USDT
      remainingClaimableWeeks: Math.max(0, 10 - pendingWeeks),
      nextRankLevel: 2,
      nextRankName: 'Silver',
      nextRankRequiredDirects: 25,
      nextRankProgressPercent: Math.round((12 / 25) * 100), // 48%
      remainingDirectsForNext: 13, // 25 - 12
      totalSalaryEarnedUsdt: 150.00, // In USDT
      totalSalaryClaimedUsdt: totalClaimed, // In USDT
      totalClaimsCount: claimsCount,
      lifetimeSalaryEarnedUsdt: 150.00, // In USDT
      lifetimeSalaryClaimedUsdt: totalClaimed, // In USDT
      highestRank: 'Bronze',
      claimFeeMbttc: 5.00, // MBTTC is used ONLY as claim fee token
      nextClaimRemainingSeconds: this.salaryContractTimer.remainingSeconds,
      nextClaimDateFormatted: 'Monday, 00:00 UTC',
      contractAddress: this.salaryContractTimer.contractAddress,
      contractName: this.salaryContractTimer.contractName,
      isClaimAvailable: !this.sessionClaimedSalary && this.salaryContractTimer.isClaimWindowOpen,
    };
  }

  async getSalaryRankRoadmap(): Promise<WeeklySalaryRankItem[]> {
    return [
      {
        rankLevel: 1,
        rankName: 'Bronze',
        requiredDirects: 10,
        additionalDirects: 10,
        weeklySalaryUsdt: 15,
        maxWeeks: 10,
        totalPotentialUsdt: 150,
        status: 'current',
        iconStyle: 'Premium bronze shield badge',
        animation: 'Soft metallic shine',
        colorScheme: {
          badgeBg: 'from-amber-950/70 to-orange-950/50',
          border: 'border-amber-700/50',
          text: 'text-amber-400',
          glow: 'shadow-[0_0_20px_rgba(217,119,6,0.25)]',
          accent: '#d97706',
        },
      },
      {
        rankLevel: 2,
        rankName: 'Silver',
        requiredDirects: 25,
        additionalDirects: 15,
        weeklySalaryUsdt: 30,
        maxWeeks: 11,
        totalPotentialUsdt: 330,
        status: 'next',
        iconStyle: 'Premium silver medal badge',
        animation: 'Smooth silver light sweep',
        colorScheme: {
          badgeBg: 'from-slate-800/80 to-zinc-900/80',
          border: 'border-slate-400/50',
          text: 'text-slate-200',
          glow: 'shadow-[0_0_20px_rgba(226,232,240,0.22)]',
          accent: '#e2e8f0',
        },
      },
      {
        rankLevel: 3,
        rankName: 'Gold',
        requiredDirects: 50,
        additionalDirects: 25,
        weeklySalaryUsdt: 50,
        maxWeeks: 12,
        totalPotentialUsdt: 600,
        status: 'locked',
        iconStyle: 'Premium gold crown badge',
        animation: 'Warm golden shimmer',
        colorScheme: {
          badgeBg: 'from-amber-900/60 to-yellow-950/80',
          border: 'border-yellow-400/50',
          text: 'text-yellow-300',
          glow: 'shadow-[0_0_25px_rgba(250,204,21,0.3)]',
          accent: '#facc15',
        },
      },
      {
        rankLevel: 4,
        rankName: 'Platinum',
        requiredDirects: 100,
        additionalDirects: 50,
        weeklySalaryUsdt: 100,
        maxWeeks: 12,
        totalPotentialUsdt: 1200,
        status: 'locked',
        iconStyle: 'Premium platinum crystal',
        animation: 'Elegant crystal glow',
        colorScheme: {
          badgeBg: 'from-cyan-950/60 to-teal-950/70',
          border: 'border-cyan-400/50',
          text: 'text-cyan-300',
          glow: 'shadow-[0_0_20px_rgba(34,211,238,0.25)]',
          accent: '#22d3ee',
        },
      },
      {
        rankLevel: 5,
        rankName: 'Diamond',
        requiredDirects: 250,
        additionalDirects: 150,
        weeklySalaryUsdt: 250,
        maxWeeks: 13,
        totalPotentialUsdt: 3250,
        status: 'locked',
        iconStyle: 'Premium diamond solitaire',
        animation: 'Diamond sparkle/pulse',
        colorScheme: {
          badgeBg: 'from-blue-950/40 to-sky-950/40',
          border: 'border-sky-500/40',
          text: 'text-sky-300',
          glow: 'shadow-[0_0_20px_rgba(56,189,248,0.2)]',
          accent: '#38bdf8',
        },
      },
      {
        rankLevel: 6,
        rankName: 'Blue Diamond',
        requiredDirects: 500,
        additionalDirects: 250,
        weeklySalaryUsdt: 500,
        maxWeeks: 12,
        totalPotentialUsdt: 6000,
        status: 'locked',
        iconStyle: 'Premium royal blue crystal',
        animation: 'Subtle energy wave',
        colorScheme: {
          badgeBg: 'from-blue-950/50 to-indigo-950/50',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
          accent: '#3b82f6',
        },
      },
      {
        rankLevel: 7,
        rankName: 'Crown Diamond',
        requiredDirects: 1000,
        additionalDirects: 500,
        weeklySalaryUsdt: 1000,
        maxWeeks: 12,
        totalPotentialUsdt: 12000,
        status: 'locked',
        iconStyle: 'Royal sovereign crown',
        animation: 'Royal crown glow with subtle particle orbit',
        colorScheme: {
          badgeBg: 'from-emerald-950/50 to-teal-950/50',
          border: 'border-emerald-400/50',
          text: 'text-emerald-300',
          glow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]',
          accent: '#10b981',
        },
      },
    ];
  }

  async getSalaryClaimHistory(): Promise<WeeklySalaryClaimRecord[]> {
    return [...this.salaryClaimHistory];
  }

  async getRankHistory(): Promise<RankHistoryRecord[]> {
    return [...this.rankHistory];
  }

  async claimSalaryReward(): Promise<{ success: boolean; txHash: string; claimedAmountUsdt: number; totalSettledUsdt: number; claimFeeMbttc: number; message?: string }> {
    await new Promise((r) => setTimeout(r, 1400));
    const previousTotal = this.getNumberStorage('mdefi_salary_total_settled', 120.00);
    const claimedUsdt = 30.00;
    const newTotalSettled = previousTotal + claimedUsdt;
    const claimsCount = this.getNumberStorage('mdefi_salary_claims_count', 8) + 1;
    const fee = 5.00;
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    this.sessionClaimedSalary = true;
    this.setStorage('mdefi_salary_total_settled', newTotalSettled.toFixed(2));
    this.setStorage('mdefi_salary_claims_count', claimsCount.toString());
    // Note: Do NOT permanently save 0.00 to localStorage in demo mode

    const newRecord: WeeklySalaryClaimRecord = {
      id: `sal-tx-${Date.now()}`,
      claimDate: new Date().toISOString().split('T')[0],
      weeksClaimed: 2,
      weekNumbers: 'W13 & W14',
      salaryAmountUsdt: claimedUsdt,
      claimFeeMbttc: fee,
      status: 'Confirmed',
      txHash,
    };
    this.salaryClaimHistory.unshift(newRecord);
    this.setStorage('mdefi_salary_history', this.salaryClaimHistory);

    return {
      success: true,
      txHash,
      claimedAmountUsdt: claimedUsdt,
      totalSettledUsdt: newTotalSettled,
      claimFeeMbttc: fee,
      message: 'Weekly Passive Salary claimed successfully on-chain.',
    };
  }

  // Chart data in USDT
  getChartData(type: 'starter' | 'premium' | 'salary', filter: string): ClaimChartPoint[] {
    const rawPoints: Record<string, { date: string; weekLabel: string; amount: number }[]> = {
      starter: [
        { date: '2026-07-12', weekLabel: 'W7', amount: 120.00 },
        { date: '2026-07-19', weekLabel: 'W8', amount: 130.00 },
        { date: '2026-07-26', weekLabel: 'W9', amount: 135.50 },
        { date: '2026-08-02', weekLabel: 'W10', amount: 140.50 },
        { date: '2026-08-09', weekLabel: 'W11', amount: 152.00 },
        { date: '2026-08-16', weekLabel: 'W12', amount: 160.00 },
        { date: '2026-08-23', weekLabel: 'W13', amount: 175.50 },
      ],
      premium: [
        { date: '2026-07-12', weekLabel: 'W7', amount: 240.00 },
        { date: '2026-07-19', weekLabel: 'W8', amount: 260.00 },
        { date: '2026-07-26', weekLabel: 'W9', amount: 275.00 },
        { date: '2026-08-02', weekLabel: 'W10', amount: 285.00 },
        { date: '2026-08-09', weekLabel: 'W11', amount: 295.00 },
        { date: '2026-08-16', weekLabel: 'W12', amount: 310.00 },
        { date: '2026-08-23', weekLabel: 'W13', amount: 330.00 },
      ],
      salary: [
        { date: '2026-07-14', weekLabel: 'W6', amount: 60.00 },
        { date: '2026-07-21', weekLabel: 'W7', amount: 60.00 },
        { date: '2026-07-28', weekLabel: 'W8', amount: 150.00 },
        { date: '2026-08-03', weekLabel: 'W9', amount: 150.00 },
        { date: '2026-08-10', weekLabel: 'W10', amount: 150.00 },
        { date: '2026-08-17', weekLabel: 'W11', amount: 150.00 },
        { date: '2026-08-24', weekLabel: 'W12', amount: 150.00 },
      ],
    };

    const dataset = rawPoints[type] || rawPoints.starter;
    let running = 0;
    return dataset.map((pt, i) => {
      running += pt.amount;
      return {
        id: `pt-${type}-${i}`,
        date: pt.date,
        weekLabel: pt.weekLabel,
        amount: pt.amount,
        cumulative: running,
        timestamp: new Date(pt.date).getTime(),
      };
    });
  }
}

export const rewardDashboardsService = new RewardDashboardsService();
