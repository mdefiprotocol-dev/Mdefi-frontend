import { 
  NexusPackageId, 
  NexusPositionType, 
  NexusMatrixPosition, 
  NexusPackageStats, 
  NexusTransactionRecord, 
  NexusTreeData 
} from '../types/nexusMatrix';

export const nexusPositionColors: Record<NexusPositionType, {
  label: string;
  badgeLabel: string;
  gradient: string;
  borderColor: string;
  glow: string;
  dotColor: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}> = {
  self: {
    label: 'YOU (Root Node)',
    badgeLabel: 'YOU',
    gradient: 'from-amber-500/40 via-yellow-600/30 to-[#2e2005]',
    borderColor: 'border-amber-400',
    glow: 'shadow-[0_0_24px_rgba(251,191,36,0.5)]',
    dotColor: 'bg-amber-400',
    textColor: 'text-amber-300',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-500/50',
    badgeText: 'text-amber-300',
    description: 'Self root account matrix position (gold highlight)',
  },
  direct: {
    label: 'Direct Member',
    badgeLabel: 'Direct Member',
    gradient: 'from-emerald-500/35 via-emerald-950/50 to-[#032014]',
    borderColor: 'border-emerald-400/80',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-500/50',
    badgeText: 'text-emerald-300',
    description: 'Personally sponsored direct partner placement (green gradient)',
  },
  spill: {
    label: 'Spillover',
    badgeLabel: 'Spillover',
    gradient: 'from-pink-500/35 via-fuchsia-950/50 to-[#23061c]',
    borderColor: 'border-pink-400/80',
    glow: 'shadow-[0_0_20px_rgba(236,72,153,0.35)]',
    dotColor: 'bg-pink-400',
    textColor: 'text-pink-300',
    badgeBg: 'bg-pink-950/80',
    badgeBorder: 'border-pink-500/50',
    badgeText: 'text-pink-300',
    description: 'Placement received via upline or team spillover (pink/magenta gradient)',
  },
  recycle: {
    label: 'Recycle / Re-entry',
    badgeLabel: 'Recycle',
    gradient: 'from-rose-600/40 via-red-950/60 to-[#270507]',
    borderColor: 'border-rose-500',
    glow: 'shadow-[0_0_22px_rgba(244,63,94,0.45)]',
    dotColor: 'bg-rose-500',
    textColor: 'text-rose-300',
    badgeBg: 'bg-rose-950/90',
    badgeBorder: 'border-rose-500/60',
    badgeText: 'text-rose-300',
    description: 'Position placed through contract auto-recycle / re-entry (red/crimson gradient)',
  },
  empty: {
    label: 'Available Position',
    badgeLabel: 'Available',
    gradient: 'from-zinc-900/50 via-zinc-950/70 to-[#090b0a]',
    borderColor: 'border-zinc-700/60',
    glow: 'shadow-none',
    dotColor: 'bg-zinc-600',
    textColor: 'text-zinc-400',
    badgeBg: 'bg-zinc-900/80',
    badgeBorder: 'border-zinc-700/50',
    badgeText: 'text-zinc-400',
    description: 'Open available slot waiting for matrix placement (neutral dark gradient)',
  },
};

// Helper to construct exactly 30 positions for a package
// Ring 1 (L1): 2 positions (1, 2)
// Ring 2 (L2): 4 positions (3, 4, 5, 6)
// Ring 3 (L3): 8 positions (7 to 14)
// Ring 4 (L4): 16 positions (15 to 30)
function generateQuantumNodePositions(): NexusMatrixPosition[] {
  const positions: NexusMatrixPosition[] = [];

  // Ring 1 (L1) - 2 positions (Both filled)
  positions.push({
    positionNumber: 1,
    level: 1,
    ringIndex: 1,
    slotInRing: 1,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-88120',
    walletAddress: '0x3a4f...89e1',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 24, 2026, 11:20 UTC',
    parentPositionNumber: 0,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L1 Direct Placement — Qualified',
  });
  positions.push({
    positionNumber: 2,
    level: 1,
    ringIndex: 1,
    slotInRing: 2,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-90142',
    walletAddress: '0x7c81...22d4',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 25, 2026, 15:40 UTC',
    parentPositionNumber: 0,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L1 Direct Placement — Qualified',
  });

  // Ring 2 (L2) - 4 positions (4 filled: 2 direct, 2 spillover)
  positions.push({
    positionNumber: 3,
    level: 2,
    ringIndex: 2,
    slotInRing: 1,
    type: 'spill',
    status: 'Filled',
    userId: 'MDF-76119',
    walletAddress: '0x1f56...9a0c',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 26, 2026, 09:15 UTC',
    parentPositionNumber: 1,
    directSponsorId: 'MDF-65400',
    isDirect: false,
    isSpillover: true,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L2 Spillover from Sponsor',
  });
  positions.push({
    positionNumber: 4,
    level: 2,
    ringIndex: 2,
    slotInRing: 2,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-91823',
    walletAddress: '0x44cd...71b2',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 27, 2026, 18:30 UTC',
    parentPositionNumber: 1,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L2 Direct Referral Placement',
  });
  positions.push({
    positionNumber: 5,
    level: 2,
    ringIndex: 2,
    slotInRing: 3,
    type: 'spill',
    status: 'Filled',
    userId: 'MDF-82001',
    walletAddress: '0x99a2...3e44',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 28, 2026, 12:44 UTC',
    parentPositionNumber: 2,
    directSponsorId: 'MDF-70012',
    isDirect: false,
    isSpillover: true,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L2 Spillover placement',
  });
  positions.push({
    positionNumber: 6,
    level: 2,
    ringIndex: 2,
    slotInRing: 4,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-94420',
    walletAddress: '0x62e8...fa19',
    matrixNumber: 2,
    recycleNumber: 1,
    activationDate: 'Aug 29, 2026, 21:05 UTC',
    parentPositionNumber: 2,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 14,
    note: 'L2 Direct Referral Placement',
  });

  // Ring 3 (L3) - 8 positions (7 filled, 1 available)
  const l3Configs: Array<{ type: NexusPositionType; status: 'Filled' | 'Available'; userId?: string; wallet?: string; parent: number; isRecycle?: boolean; isSpill?: boolean; isDirect?: boolean }> = [
    { type: 'direct', status: 'Filled', userId: 'MDF-95101', wallet: '0x12ab...34cd', parent: 3, isDirect: true },
    { type: 'spill', status: 'Filled', userId: 'MDF-80419', wallet: '0x56ef...78gh', parent: 3, isSpill: true },
    { type: 'recycle', status: 'Filled', userId: 'MDF-772910', wallet: '0x71C8...4982', parent: 4, isRecycle: true }, // Recycle placement
    { type: 'direct', status: 'Filled', userId: 'MDF-96340', wallet: '0x90ij...12kl', parent: 4, isDirect: true },
    { type: 'spill', status: 'Filled', userId: 'MDF-83210', wallet: '0x34mn...56op', parent: 5, isSpill: true },
    { type: 'direct', status: 'Filled', userId: 'MDF-97002', wallet: '0x78qr...90st', parent: 5, isDirect: true },
    { type: 'spill', status: 'Filled', userId: 'MDF-84199', wallet: '0xuvwx...1234', parent: 6, isSpill: true },
    { type: 'empty', status: 'Available', parent: 6 },
  ];

  l3Configs.forEach((cfg, idx) => {
    positions.push({
      positionNumber: 7 + idx,
      level: 3,
      ringIndex: 3,
      slotInRing: idx + 1,
      type: cfg.type,
      status: cfg.status,
      userId: cfg.userId,
      walletAddress: cfg.wallet,
      matrixNumber: 2,
      recycleNumber: 1,
      activationDate: cfg.status === 'Filled' ? `Aug ${30 + (idx % 2)}, 2026, 14:0${idx} UTC` : undefined,
      parentPositionNumber: cfg.parent,
      directSponsorId: cfg.isDirect ? 'MDF-772910' : undefined,
      isDirect: !!cfg.isDirect,
      isSpillover: !!cfg.isSpill,
      isRecycle: !!cfg.isRecycle,
      incomeGeneratedUSD: cfg.status === 'Filled' ? 14 : 0,
      note: cfg.isRecycle ? 'L3 Contract Auto-Recycle Re-entry' : cfg.status === 'Filled' ? 'L3 Active Node' : 'Awaiting Next Placement',
    });
  });

  // Ring 4 (L4) - 16 positions (6 filled, 10 available)
  const l4FilledIndices = [0, 2, 5, 8, 11, 14]; // 6 filled
  for (let i = 0; i < 16; i++) {
    const isFilled = l4FilledIndices.includes(i);
    const parentPos = 7 + Math.floor(i / 2);
    let type: NexusPositionType = 'empty';
    if (isFilled) {
      if (i === 5) type = 'recycle';
      else if (i % 2 === 0) type = 'direct';
      else type = 'spill';
    }

    positions.push({
      positionNumber: 15 + i,
      level: 4,
      ringIndex: 4,
      slotInRing: i + 1,
      type: type,
      status: isFilled ? 'Filled' : 'Available',
      userId: isFilled ? `MDF-${98000 + i * 37}` : undefined,
      walletAddress: isFilled ? `0x${(15 + i).toString(16).padStart(4, '0')}...${(99 - i).toString(16).padStart(4, '0')}` : undefined,
      matrixNumber: 2,
      recycleNumber: 1,
      activationDate: isFilled ? `Sep 0${(i % 4) + 1}, 2026, 10:${(i * 3).toString().padStart(2, '0')} UTC` : undefined,
      parentPositionNumber: parentPos,
      directSponsorId: type === 'direct' ? 'MDF-772910' : undefined,
      isDirect: type === 'direct',
      isSpillover: type === 'spill',
      isRecycle: type === 'recycle',
      incomeGeneratedUSD: isFilled ? 14 : 0,
      note: type === 'recycle' ? 'L4 Recycle / Re-entry Position' : isFilled ? 'L4 Matrix Node' : 'Open Available Matrix Slot',
    });
  }

  return positions;
}

function generateNexusPrimePositions(): NexusMatrixPosition[] {
  const positions: NexusMatrixPosition[] = [];

  // Ring 1 (L1) - 2 positions (Both filled)
  positions.push({
    positionNumber: 1,
    level: 1,
    ringIndex: 1,
    slotInRing: 1,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-61044',
    walletAddress: '0x88f1...19c2',
    matrixNumber: 1,
    recycleNumber: 0,
    activationDate: 'Aug 28, 2026, 16:30 UTC',
    parentPositionNumber: 0,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 24,
    note: 'L1 Prime Direct Member Placement',
  });
  positions.push({
    positionNumber: 2,
    level: 1,
    ringIndex: 1,
    slotInRing: 2,
    type: 'spill',
    status: 'Filled',
    userId: 'MDF-62910',
    walletAddress: '0x43d2...77a9',
    matrixNumber: 1,
    recycleNumber: 0,
    activationDate: 'Aug 29, 2026, 19:10 UTC',
    parentPositionNumber: 0,
    directSponsorId: 'MDF-55010',
    isDirect: false,
    isSpillover: true,
    isRecycle: false,
    incomeGeneratedUSD: 24,
    note: 'L1 Prime Spillover from Upline',
  });

  // Ring 2 (L2) - 4 positions (3 filled, 1 available)
  positions.push({
    positionNumber: 3,
    level: 2,
    ringIndex: 2,
    slotInRing: 1,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-63200',
    walletAddress: '0x90a1...22e3',
    matrixNumber: 1,
    recycleNumber: 0,
    activationDate: 'Aug 30, 2026, 08:45 UTC',
    parentPositionNumber: 1,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 24,
    note: 'L2 Direct Prime Node',
  });
  positions.push({
    positionNumber: 4,
    level: 2,
    ringIndex: 2,
    slotInRing: 2,
    type: 'spill',
    status: 'Filled',
    userId: 'MDF-64119',
    walletAddress: '0x14b9...66f0',
    matrixNumber: 1,
    recycleNumber: 0,
    activationDate: 'Aug 31, 2026, 12:20 UTC',
    parentPositionNumber: 1,
    directSponsorId: 'MDF-59002',
    isDirect: false,
    isSpillover: true,
    isRecycle: false,
    incomeGeneratedUSD: 24,
    note: 'L2 Spillover placement',
  });
  positions.push({
    positionNumber: 5,
    level: 2,
    ringIndex: 2,
    slotInRing: 3,
    type: 'direct',
    status: 'Filled',
    userId: 'MDF-65088',
    walletAddress: '0x77c4...88d1',
    matrixNumber: 1,
    recycleNumber: 0,
    activationDate: 'Sep 01, 2026, 14:50 UTC',
    parentPositionNumber: 2,
    directSponsorId: 'MDF-772910',
    isDirect: true,
    isSpillover: false,
    isRecycle: false,
    incomeGeneratedUSD: 24,
    note: 'L2 Direct Prime Node',
  });
  positions.push({
    positionNumber: 6,
    level: 2,
    ringIndex: 2,
    slotInRing: 4,
    type: 'empty',
    status: 'Available',
    parentPositionNumber: 2,
    matrixNumber: 1,
    recycleNumber: 0,
    isDirect: false,
    isSpillover: false,
    isRecycle: false,
    note: 'Available for next Prime member',
  });

  // Ring 3 (L3) - 8 positions (3 filled: 1 direct, 1 spill, 1 recycle, 5 available)
  for (let i = 0; i < 8; i++) {
    const parentPos = 3 + Math.floor(i / 2);
    if (i === 0) {
      positions.push({
        positionNumber: 7,
        level: 3,
        ringIndex: 3,
        slotInRing: 1,
        type: 'direct',
        status: 'Filled',
        userId: 'MDF-66410',
        walletAddress: '0x22ee...99a0',
        matrixNumber: 1,
        recycleNumber: 0,
        activationDate: 'Sep 02, 2026, 10:15 UTC',
        parentPositionNumber: parentPos,
        directSponsorId: 'MDF-772910',
        isDirect: true,
        isSpillover: false,
        isRecycle: false,
        incomeGeneratedUSD: 24,
        note: 'L3 Direct Prime Placement',
      });
    } else if (i === 1) {
      positions.push({
        positionNumber: 8,
        level: 3,
        ringIndex: 3,
        slotInRing: 2,
        type: 'spill',
        status: 'Filled',
        userId: 'MDF-67012',
        walletAddress: '0x33aa...bb11',
        matrixNumber: 1,
        recycleNumber: 0,
        activationDate: 'Sep 02, 2026, 17:35 UTC',
        parentPositionNumber: parentPos,
        directSponsorId: 'MDF-58100',
        isDirect: false,
        isSpillover: true,
        isRecycle: false,
        incomeGeneratedUSD: 24,
        note: 'L3 Spillover Placement',
      });
    } else if (i === 2) {
      positions.push({
        positionNumber: 9,
        level: 3,
        ringIndex: 3,
        slotInRing: 3,
        type: 'recycle',
        status: 'Filled',
        userId: 'MDF-59001',
        walletAddress: '0x44bb...cc22',
        matrixNumber: 1,
        recycleNumber: 0,
        activationDate: 'Sep 03, 2026, 11:20 UTC',
        parentPositionNumber: parentPos,
        directSponsorId: 'MDF-772910',
        isDirect: false,
        isSpillover: false,
        isRecycle: true,
        incomeGeneratedUSD: 24,
        note: 'L3 Recycle / Re-entry Position',
      });
    } else {
      positions.push({
        positionNumber: 7 + i,
        level: 3,
        ringIndex: 3,
        slotInRing: i + 1,
        type: 'empty',
        status: 'Available',
        parentPositionNumber: parentPos,
        matrixNumber: 1,
        recycleNumber: 0,
        isDirect: false,
        isSpillover: false,
        isRecycle: false,
        note: 'Open Available Matrix Slot',
      });
    }
  }

  // Ring 4 (L4) - 16 positions (All 16 available)
  for (let i = 0; i < 16; i++) {
    const parentPos = 7 + Math.floor(i / 2);
    positions.push({
      positionNumber: 15 + i,
      level: 4,
      ringIndex: 4,
      slotInRing: i + 1,
      type: 'empty',
      status: 'Available',
      parentPositionNumber: parentPos,
      matrixNumber: 1,
      recycleNumber: 0,
      isDirect: false,
      isSpillover: false,
      isRecycle: false,
      note: 'Available Prime Matrix Slot',
    });
  }

  return positions;
}

// 1. QUANTUM NODE DATA (Package ID: 1, $70)
export const quantumNodeTreeData: NexusTreeData = {
  packageId: 1,
  packageName: 'Quantum Node',
  priceUSD: 70,
  currentMatrixNumber: 2,
  recycleCount: 1,
  rootUser: {
    userId: 'MDF-772910 (YOU)',
    walletAddress: '0x71C8395B...4982',
    matrixNumber: 2,
    recycleCount: 1,
  },
  positions: generateQuantumNodePositions(),
};

export const quantumNodeStats: NexusPackageStats = {
  packageId: 1,
  name: 'Quantum Node',
  priceUSD: 70,
  status: 'Active',
  activationDate: 'Aug 20, 2026, 10:00 UTC',
  currentMatrixNumber: 2,
  recycleCount: 1,
  lastRecycleDate: 'Aug 29, 2026, 18:30 UTC',
  totalPositions: 30,
  filledPositions: 19,
  availablePositions: 11,
  openPositions: 11,
  directMembersCount: 7,
  directPlacements: 7,
  spilloverMembersCount: 8,
  spilloverCount: 8,
  recyclePositionsCount: 4,
  completionPercentage: Math.round((19 / 30) * 100),
  directIncomeSupported: '$14.00 (20%)',
  matrixIncomeSupported: '$14.00 (20%)',
  matrixIncomeUSD: 14.00,
  recycleIncomeSupported: 'Auto Re-entry at Slot #30',
  totalCycleEstimateSupported: 'Supported by Contract Rules',
};

export const quantumNodeTransactions: NexusTransactionRecord[] = [
  {
    id: 'qtx-101',
    packageId: 1,
    dateTime: 'Aug 20, 2026, 10:00 UTC',
    type: 'Package Activation',
    package: 'Quantum Node',
    position: 'Root (Center)',
    member: 'MDF-772910 (YOU)',
    memberWallet: '0x71C8395B...4982',
    amount: '$70.00 USD',
    status: 'Confirmed',
    txHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    contractEvent: 'PackagePurchased(packageId=1, user=0x71C...)',
  },
  {
    id: 'qtx-102',
    packageId: 1,
    dateTime: 'Aug 24, 2026, 11:20 UTC',
    type: 'Direct Placement',
    package: 'Quantum Node',
    position: 'Slot #1 (L1)',
    member: 'MDF-88120',
    memberWallet: '0x3a4f...89e1',
    amount: '+$14.00 USD',
    status: 'Confirmed',
    txHash: '0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    contractEvent: 'DirectIncomePaid(packageId=1, slot=1)',
  },
  {
    id: 'qtx-103',
    packageId: 1,
    dateTime: 'Aug 25, 2026, 15:40 UTC',
    type: 'Direct Placement',
    package: 'Quantum Node',
    position: 'Slot #2 (L1)',
    member: 'MDF-90142',
    memberWallet: '0x7c81...22d4',
    amount: '+$14.00 USD',
    status: 'Confirmed',
    txHash: '0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f',
    contractEvent: 'DirectIncomePaid(packageId=1, slot=2)',
  },
  {
    id: 'qtx-104',
    packageId: 1,
    dateTime: 'Aug 26, 2026, 09:15 UTC',
    type: 'Spillover',
    package: 'Quantum Node',
    position: 'Slot #3 (L2)',
    member: 'MDF-76119',
    memberWallet: '0x1f56...9a0c',
    amount: '+$14.00 USD',
    status: 'Confirmed',
    txHash: '0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
    contractEvent: 'MatrixSpilloverPlaced(packageId=1, slot=3)',
  },
  {
    id: 'qtx-105',
    packageId: 1,
    dateTime: 'Aug 29, 2026, 18:30 UTC',
    type: 'Recycle',
    package: 'Quantum Node',
    position: 'Cycle #1 Completed',
    member: 'MDF-772910 (YOU)',
    memberWallet: '0x71C8395B...4982',
    amount: 'Auto Re-entry',
    status: 'Confirmed',
    txHash: '0x7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    contractEvent: 'MatrixRecycled(packageId=1, newMatrixId=2)',
  },
  {
    id: 'qtx-106',
    packageId: 1,
    dateTime: 'Aug 30, 2026, 14:02 UTC',
    type: 'Matrix Income',
    package: 'Quantum Node',
    position: 'Slot #9 (L3)',
    member: 'MDF-772910 (YOU)',
    memberWallet: '0x71C8395B...4982',
    amount: '+$14.00 USD',
    status: 'Confirmed',
    txHash: '0x9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
    contractEvent: 'MatrixLevelReward(packageId=1, level=3)',
  },
  {
    id: 'qtx-107',
    packageId: 1,
    dateTime: 'Sep 02, 2026, 10:45 UTC',
    type: 'Matrix Placement',
    package: 'Quantum Node',
    position: 'Slot #17 (L4)',
    member: 'MDF-98074',
    memberWallet: '0x0011...0062',
    amount: '+$14.00 USD',
    status: 'Confirmed',
    txHash: '0xb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
    contractEvent: 'NodeActivated(packageId=1, slot=17)',
  },
];

// 2. NEXUS PRIME NODE DATA (Package ID: 2, $120)
export const nexusPrimeTreeData: NexusTreeData = {
  packageId: 2,
  packageName: 'Nexus Prime Node',
  priceUSD: 120,
  currentMatrixNumber: 1,
  recycleCount: 0,
  rootUser: {
    userId: 'MDF-772910 (YOU)',
    walletAddress: '0x71C8395B...4982',
    matrixNumber: 1,
    recycleCount: 0,
  },
  positions: generateNexusPrimePositions(),
};

export const nexusPrimeStats: NexusPackageStats = {
  packageId: 2,
  name: 'Nexus Prime Node',
  priceUSD: 120,
  status: 'Active',
  activationDate: 'Aug 28, 2026, 14:00 UTC',
  currentMatrixNumber: 1,
  recycleCount: 0,
  lastRecycleDate: undefined,
  totalPositions: 30,
  filledPositions: 8,
  availablePositions: 22,
  openPositions: 22,
  directMembersCount: 4,
  directPlacements: 4,
  spilloverMembersCount: 3,
  spilloverCount: 3,
  recyclePositionsCount: 1,
  completionPercentage: Math.round((8 / 30) * 100),
  directIncomeSupported: '$24.00 (20%)',
  matrixIncomeSupported: '$24.00 (20%)',
  matrixIncomeUSD: 24.00,
  recycleIncomeSupported: 'Auto Re-entry at Slot #30',
  totalCycleEstimateSupported: 'Supported by Contract Rules',
};

export const nexusPrimeTransactions: NexusTransactionRecord[] = [
  {
    id: 'nptx-201',
    packageId: 2,
    dateTime: 'Aug 28, 2026, 14:00 UTC',
    type: 'Package Activation',
    package: 'Nexus Prime Node',
    position: 'Root (Center)',
    member: 'MDF-772910 (YOU)',
    memberWallet: '0x71C8395B...4982',
    amount: '$120.00 USD',
    status: 'Confirmed',
    txHash: '0xfa12b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    contractEvent: 'PackagePurchased(packageId=2, user=0x71C...)',
  },
  {
    id: 'nptx-202',
    packageId: 2,
    dateTime: 'Aug 28, 2026, 16:30 UTC',
    type: 'Direct Placement',
    package: 'Nexus Prime Node',
    position: 'Slot #1 (L1)',
    member: 'MDF-61044',
    memberWallet: '0x88f1...19c2',
    amount: '+$24.00 USD',
    status: 'Confirmed',
    txHash: '0x22d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0',
    contractEvent: 'DirectIncomePaid(packageId=2, slot=1)',
  },
  {
    id: 'nptx-203',
    packageId: 2,
    dateTime: 'Aug 29, 2026, 19:10 UTC',
    type: 'Spillover',
    package: 'Nexus Prime Node',
    position: 'Slot #2 (L1)',
    member: 'MDF-62910',
    memberWallet: '0x43d2...77a9',
    amount: '+$24.00 USD',
    status: 'Confirmed',
    txHash: '0x44e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2',
    contractEvent: 'MatrixSpilloverPlaced(packageId=2, slot=2)',
  },
  {
    id: 'nptx-204',
    packageId: 2,
    dateTime: 'Aug 30, 2026, 08:45 UTC',
    type: 'Direct Placement',
    package: 'Nexus Prime Node',
    position: 'Slot #3 (L2)',
    member: 'MDF-63200',
    memberWallet: '0x90a1...22e3',
    amount: '+$24.00 USD',
    status: 'Confirmed',
    txHash: '0x66f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4',
    contractEvent: 'DirectIncomePaid(packageId=2, slot=3)',
  },
  {
    id: 'nptx-205',
    packageId: 2,
    dateTime: 'Sep 01, 2026, 14:50 UTC',
    type: 'Direct Placement',
    package: 'Nexus Prime Node',
    position: 'Slot #5 (L2)',
    member: 'MDF-65088',
    memberWallet: '0x77c4...88d1',
    amount: '+$24.00 USD',
    status: 'Confirmed',
    txHash: '0x88a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6',
    contractEvent: 'DirectIncomePaid(packageId=2, slot=5)',
  },
  {
    id: 'nptx-206',
    packageId: 2,
    dateTime: 'Sep 03, 2026, 11:20 UTC',
    type: 'Recycle',
    package: 'Nexus Prime Node',
    position: 'Slot #9 (L3)',
    member: 'MDF-59001',
    memberWallet: '0x44bb...cc22',
    amount: '+$24.00 USD',
    status: 'Confirmed',
    txHash: '0xaa0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8',
    contractEvent: 'MatrixRecycledPlacement(packageId=2, slot=9)',
  },
];
