/**
 * MDeFi Protocol & Blockchain Contract Configuration
 * Pre-Mainnet / Contract-Ready Centralized Registry
 * 
 * DIRECTIVES:
 * - Smart contracts are NOT deployed yet.
 * - Current mode is DEMO / SIMULATED mode.
 * - No fake or invented contract addresses on Mainnet.
 * - Once deployed, addresses are configured here as the single source of truth.
 */

export interface ContractDeploymentConfig {
  isDeployed: boolean;
  networkName: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
}

export const NETWORK_CONFIG: ContractDeploymentConfig = {
  isDeployed: true, // Pre-deployment: set to true ONLY when smart contracts are deployed
  networkName: 'BNB Smart Chain testnet(BEP-20)',
  chainId: 97, // BSC Mainnet testnet
  rpcUrl: 'https://data-seed-prebsc-1-s1.bnbchain.org/',
  explorerUrl: 'https://testnet.bscscan.com',
};

// Contract addresses - Left empty until official BSC Testnet / Mainnet contract deployment
// DIRECTIVE: Smart contracts are NOT deployed yet. Do NOT invent fake addresses.
export const CONTRACT_ADDRESSES = {
  // Phase 1: Core Protocol & Native Token
  mdefiHub: '0xdCE567cd83ED6A6bC4c4F411671Bc2fe20d49FE9',
  mbttcToken: '0x7116BAFaDCBEe81b562Db083d2b08b462B761186',
  // Phase 2: S4 Matrix, Starter Pool & Liquidity
  s4Matrix: '',
  starterReward: '',
  liquidityPool: '',
  // Phase 3: Quantum/Nexus Matrices, Premium Reward & Weekly Salary
  quantumNexus: '',
  nexusPrime: '',
  premiumReward: '',
  salaryContract: '',
  // Phase 4: PancakeSwap DEX Router & Liquidity Pair
  tradingRouter: '',
  tradingPair: '',
  // Auxiliary Ecosystem & Protocol References
  treasuryIpo: '',
  // Standard BEP-20 Dead Address
  burnDead: '0x000000000000000000000000000000000000dEaD',
  // Real external standard BEP-20 USDT on BNB Smart Chain
  usdtBsc: '0x55d398326f99059fF775485246999027B3197955',
};

/**
 * Explicit Named Address Constants Across All 4 Phases
 * Ready to receive official addresses upon deployment.
 * Do NOT invent fake addresses before official deployment.
 */
export const HUB_ADDRESS: string = CONTRACT_ADDRESSES.mdefiHub;
export const MBTTC_ADDRESS: string = CONTRACT_ADDRESSES.mbttcToken;
export const S4_ADDRESS: string = CONTRACT_ADDRESSES.s4Matrix;
export const STARTER_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.starterReward;
export const LIQUIDITY_POOL_ADDRESS: string = CONTRACT_ADDRESSES.liquidityPool;
export const QUANTUM_NEXUS_ADDRESS: string = CONTRACT_ADDRESSES.quantumNexus;
export const NEXUS_PRIME_ADDRESS: string = CONTRACT_ADDRESSES.nexusPrime;
export const PREMIUM_REWARD_ADDRESS: string = CONTRACT_ADDRESSES.premiumReward;
export const SALARY_ADDRESS: string = CONTRACT_ADDRESSES.salaryContract;
export const TRADING_ROUTER_ADDRESS: string = CONTRACT_ADDRESSES.tradingRouter;
export const TRADING_PAIR_ADDRESS: string = CONTRACT_ADDRESSES.tradingPair;
export const TREASURY_IPO_ADDRESS: string = CONTRACT_ADDRESSES.treasuryIpo;

/**
 * Phase 1 -> Phase 4 Contract Verified ABIs
 * Empty readonly arrays until official deployment & verification.
 * Prevents guessing function signatures before deployment.
 */
export const HUB_ABI: readonly any[] = [{"inputs":[{"internalType":"address","name":"_superAdminAddress","type":"address"},{"internalType":"address","name":"_mbttc","type":"address"},{"internalType":"address","name":"_usdt","type":"address"},{"internalType":"address","name":"_vault","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AddressZero","type":"error"},{"inputs":[],"name":"AlphaFeeFailed","type":"error"},{"inputs":[],"name":"AlreadyRegistered","type":"error"},{"inputs":[],"name":"ContractPaused","type":"error"},{"inputs":[],"name":"DAOVaultFailed","type":"error"},{"inputs":[],"name":"IncorrectPackagePrice","type":"error"},{"inputs":[],"name":"InsufficientBNBFee","type":"error"},{"inputs":[],"name":"InvalidPackageConfiguration","type":"error"},{"inputs":[],"name":"InvalidPaginationParameters","type":"error"},{"inputs":[],"name":"InvalidUpline","type":"error"},{"inputs":[],"name":"MiniNodeRequiredFirst","type":"error"},{"inputs":[],"name":"MintFailed","type":"error"},{"inputs":[],"name":"NodeFeeFailed","type":"error"},{"inputs":[],"name":"NotAContract","type":"error"},{"inputs":[],"name":"NotRegistered","type":"error"},{"inputs":[],"name":"NothingToClaim","type":"error"},{"inputs":[],"name":"OnlyAdmin","type":"error"},{"inputs":[],"name":"OnlyAuthorizedMatrix","type":"error"},{"inputs":[],"name":"OnlyOwner","type":"error"},{"inputs":[],"name":"OnlySuperAdmin","type":"error"},{"inputs":[{"internalType":"uint256","name":"programId","type":"uint256"},{"internalType":"address","name":"plugin","type":"address"},{"internalType":"uint256","name":"packageId","type":"uint256"},{"internalType":"bytes","name":"reason","type":"bytes"}],"name":"PluginExecutionFailed","type":"error"},{"inputs":[],"name":"PluginNotConfigured","type":"error"},{"inputs":[],"name":"ReentrancyGuardReentrantCall","type":"error"},{"inputs":[],"name":"RootUserProtected","type":"error"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"SafeERC20FailedOperation","type":"error"},{"inputs":[],"name":"SelfReferenceInvalid","type":"error"},{"inputs":[],"name":"Wait4HoursForNextClaim","type":"error"},{"inputs":[],"name":"WalletBlocked","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldVal","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newVal","type":"uint256"}],"name":"BridgeAlphaThresholdChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldVault","type":"address"},{"indexed":true,"internalType":"address","name":"newVault","type":"address"}],"name":"DAOVaultChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sourceUser","type":"address"},{"indexed":true,"internalType":"address","name":"targetSponsor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FlowUpRewardAllocated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"targetUser","type":"address"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":true,"internalType":"address","name":"admin","type":"address"}],"name":"MagicOnChainActivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"packagePrice","type":"uint256"},{"indexed":true,"internalType":"address","name":"matrixPlugin","type":"address"},{"indexed":false,"internalType":"uint256","name":"realAmount","type":"uint256"}],"name":"NodeInitialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"}],"name":"PackageActivated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"payer","type":"address"},{"indexed":false,"internalType":"uint256","name":"packageAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"PackageActivatedDetailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PackageClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"isPaused","type":"bool"}],"name":"PauseStateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":true,"internalType":"address","name":"contractAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"version","type":"uint256"}],"name":"PluginConfigured","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"packageType","type":"uint256"}],"name":"PluginMetadataUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"}],"name":"PluginRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalVolume","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalUsers","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"totalRecycles","type":"uint256"}],"name":"PluginStatsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"reason","type":"bytes"}],"name":"PluginSyncFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"programId","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"packageId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"usdtCollected","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"matrixIncome","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"directIncome","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"weeklyReward","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"weeklySalary","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"daoRevenue","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"liquidityAmount","type":"uint256"}],"name":"ProgramExecutionReported","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldNode","type":"address"},{"indexed":true,"internalType":"address","name":"newNode","type":"address"}],"name":"QuantumBridgeNodeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"leader","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ReferralClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"address","name":"upline","type":"address"},{"indexed":false,"internalType":"uint256","name":"regMinted","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"refVestingAdded","type":"uint256"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldFee","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newFee","type":"uint256"}],"name":"RegistrationFeeChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"}],"name":"RewardMintFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldToken","type":"address"},{"indexed":true,"internalType":"address","name":"newToken","type":"address"}],"name":"TokenMigrated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"burner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensBurned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"address","name":"oldUpline","type":"address"},{"indexed":true,"internalType":"address","name":"newUpline","type":"address"}],"name":"TreeRestructured","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldUSDT","type":"address"},{"indexed":true,"internalType":"address","name":"newUSDT","type":"address"}],"name":"USDTTokenMigrated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"UserBlockStatusChanged","type":"event"},{"inputs":[],"name":"MAX_PAGINATION_LIMIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_REF_REWARD_CAP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_REG_REWARD_CAP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"},{"internalType":"uint256","name":"_pkgId","type":"uint256"},{"internalType":"uint256","name":"_humanAmt","type":"uint256"}],"name":"MagicOnChain","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_v","type":"uint256"}],"name":"SetBridge_AlphaNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"address","name":"_referrer","type":"address"},{"internalType":"uint256","name":"_packageId","type":"uint256"}],"name":"allocateMatrixRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bridgeAlphaThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pkgId","type":"uint256"},{"internalType":"uint256","name":"_humanAmt","type":"uint256"}],"name":"buyPackage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"},{"internalType":"uint256","name":"_pkgId","type":"uint256"},{"internalType":"uint256","name":"_humanAmt","type":"uint256"}],"name":"buyPackageByAlpha","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"},{"internalType":"uint256","name":"_p","type":"uint256"}],"name":"checkUserPackageActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimPackageReward","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"claimReferralReward","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"claimablePackage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_leader","type":"address"}],"name":"claimableReferral","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_programId","type":"uint256"},{"internalType":"address","name":"_contractAddress","type":"address"}],"name":"configurePluginSocket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"configuredPackageIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"fixedRegistrationFeeInBNB","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getConfiguredPackageIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEcosystemStats","outputs":[{"components":[{"internalType":"uint256","name":"totalRegisteredUsers","type":"uint256"},{"internalType":"uint256","name":"totalActiveUsers","type":"uint256"},{"internalType":"uint256","name":"totalPackagesSold","type":"uint256"},{"internalType":"uint256","name":"totalPackageVolume","type":"uint256"},{"internalType":"uint256","name":"totalUSDTCollected","type":"uint256"},{"internalType":"uint256","name":"totalDirectIncome","type":"uint256"},{"internalType":"uint256","name":"totalMatrixIncome","type":"uint256"},{"internalType":"uint256","name":"totalWeeklyRewards","type":"uint256"},{"internalType":"uint256","name":"totalWeeklySalary","type":"uint256"},{"internalType":"uint256","name":"totalDAORevenue","type":"uint256"},{"internalType":"uint256","name":"totalEcosystemRewards","type":"uint256"}],"internalType":"struct MDEFIEnterpriseHubUnified.EcosystemStats","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getGlobalTokenStats","outputs":[{"components":[{"internalType":"uint256","name":"totalRegistrationMinted","type":"uint256"},{"internalType":"uint256","name":"totalReferralMinted","type":"uint256"},{"internalType":"uint256","name":"totalPackageMinted","type":"uint256"},{"internalType":"uint256","name":"totalClaimedTokens","type":"uint256"},{"internalType":"uint256","name":"totalBurnedTokens","type":"uint256"},{"internalType":"uint256","name":"totalPendingRewards","type":"uint256"},{"internalType":"uint256","name":"circulatingSupply","type":"uint256"}],"internalType":"struct MDEFIEnterpriseHubUnified.GlobalTokenStats","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPhaseRewards","outputs":[{"internalType":"uint256","name":"regReward","type":"uint256"},{"internalType":"uint256","name":"refReward","type":"uint256"},{"internalType":"uint256","name":"user25PkgReward","type":"uint256"},{"internalType":"uint256","name":"sponsor25Reward","type":"uint256"},{"internalType":"uint256","name":"sponsor10Reward","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_programId","type":"uint256"},{"internalType":"uint256","name":"_packageId","type":"uint256"}],"name":"getPluginStatistics","outputs":[{"components":[{"internalType":"uint256","name":"totalUsers","type":"uint256"},{"internalType":"uint256","name":"activeUsers","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"},{"internalType":"uint256","name":"totalIncome","type":"uint256"},{"internalType":"uint256","name":"totalRewards","type":"uint256"},{"internalType":"uint256","name":"queueSize","type":"uint256"},{"internalType":"uint256","name":"matrixCompletions","type":"uint256"},{"internalType":"uint256","name":"totalRecycles","type":"uint256"},{"internalType":"uint256","name":"lastReportTimestamp","type":"uint256"}],"internalType":"struct MDEFIEnterpriseHubUnified.PluginStats","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserDashboard","outputs":[{"components":[{"internalType":"uint256","name":"userId","type":"uint256"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"sponsor","type":"address"},{"internalType":"uint256","name":"registrationTime","type":"uint256"},{"internalType":"uint256","name":"directTeamCount","type":"uint256"},{"internalType":"uint256","name":"totalTeamCount","type":"uint256"},{"internalType":"bool","name":"isBlocked","type":"bool"},{"internalType":"uint256","name":"referralTotalEarned","type":"uint256"},{"internalType":"uint256","name":"referralTotalClaimed","type":"uint256"},{"internalType":"uint256","name":"referralClaimable","type":"uint256"},{"internalType":"uint256","name":"packageTotalEarned","type":"uint256"},{"internalType":"uint256","name":"packageTotalClaimed","type":"uint256"},{"internalType":"uint256","name":"packageClaimable","type":"uint256"},{"internalType":"uint256","name":"activePackageCount","type":"uint256"}],"internalType":"struct MDEFIEnterpriseHubUnified.MasterUserDashboard","name":"dashboard","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserNode","outputs":[{"components":[{"internalType":"uint64","name":"id","type":"uint64"},{"internalType":"uint64","name":"registrationTime","type":"uint64"},{"internalType":"bool","name":"isBlocked","type":"bool"},{"internalType":"bool","name":"isRegistered","type":"bool"},{"internalType":"address","name":"wallet","type":"address"},{"internalType":"address","name":"upline","type":"address"},{"internalType":"address[]","name":"directTeam","type":"address[]"},{"internalType":"uint256","name":"totalTeam","type":"uint256"}],"internalType":"struct MDEFIEnterpriseHubUnified.UserNode","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"hasActivePackage","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"isPaused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"mbttcToken","outputs":[{"internalType":"contract IMBTTC","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"packageRegistry","outputs":[{"internalType":"uint32","name":"packageId","type":"uint32"},{"internalType":"uint32","name":"version","type":"uint32"},{"internalType":"uint128","name":"price","type":"uint128"},{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"address","name":"pluginAddress","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"uint256","name":"packageType","type":"uint256"},{"internalType":"uint256","name":"launchDate","type":"uint256"},{"internalType":"uint256","name":"totalActiveUsers","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"},{"internalType":"uint256","name":"totalRewards","type":"uint256"},{"internalType":"uint256","name":"totalRecycles","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"packageVesting","outputs":[{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"uint256","name":"totalClaimed","type":"uint256"},{"internalType":"uint256","name":"lastClaimTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"pluginPackageStatistics","outputs":[{"internalType":"uint256","name":"totalUsers","type":"uint256"},{"internalType":"uint256","name":"activeUsers","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"},{"internalType":"uint256","name":"totalIncome","type":"uint256"},{"internalType":"uint256","name":"totalRewards","type":"uint256"},{"internalType":"uint256","name":"queueSize","type":"uint256"},{"internalType":"uint256","name":"matrixCompletions","type":"uint256"},{"internalType":"uint256","name":"totalRecycles","type":"uint256"},{"internalType":"uint256","name":"lastReportTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"pluginReportedUSDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"programVersion","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_a","type":"uint256"}],"name":"recordTokenBurn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referralVesting","outputs":[{"internalType":"uint256","name":"totalEarned","type":"uint256"},{"internalType":"uint256","name":"totalClaimed","type":"uint256"},{"internalType":"uint256","name":"lastClaimTimestamp","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_uplineId","type":"uint256"}],"name":"register","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"},{"internalType":"address","name":"_up","type":"address"}],"name":"registerByAlpha","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_programId","type":"uint256"}],"name":"removePluginSocket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_programId","type":"uint256"},{"internalType":"uint256","name":"_packageId","type":"uint256"}],"name":"reportPluginStats","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_programId","type":"uint256"},{"internalType":"uint256","name":"_packageId","type":"uint256"},{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_usdtCollected","type":"uint256"},{"internalType":"uint256","name":"_matrixIncome","type":"uint256"},{"internalType":"uint256","name":"_directIncome","type":"uint256"},{"internalType":"uint256","name":"_weeklyReward","type":"uint256"},{"internalType":"uint256","name":"_weeklySalary","type":"uint256"},{"internalType":"uint256","name":"_daoRevenue","type":"uint256"},{"internalType":"uint256","name":"_liquidityAmount","type":"uint256"}],"name":"reportProgramStats","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"},{"internalType":"uint256","name":"_newUplineId","type":"uint256"}],"name":"restructureTree","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_a","type":"address"},{"internalType":"bool","name":"_s","type":"bool"}],"name":"setAdminAccess","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_v","type":"address"}],"name":"setDAOVault","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_progId","type":"uint256"},{"internalType":"string","name":"_n","type":"string"},{"internalType":"uint256","name":"_humanPrice","type":"uint256"},{"internalType":"uint256","name":"_t","type":"uint256"}],"name":"setPackageMetadata","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_n","type":"address"}],"name":"setQuantumBridgeNode","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_f","type":"uint256"}],"name":"setRegistrationFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"}],"name":"setUsdtTokenAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_u","type":"address"},{"internalType":"bool","name":"_s","type":"bool"}],"name":"setUserBlockedStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_p","type":"bool"}],"name":"togglePause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalBurnedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDAORevenue","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalDirectIncome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalEcosystemRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalLiquidity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMatrixIncome","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPackageAllocated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPackageClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPackageMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPackageVolume","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPackagesSold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReferralAllocated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReferralClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalReferralMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRegistrationMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalUSDTCollected","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalUsers","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWeeklyRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalWeeklySalary","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_m","type":"address"}],"name":"updateMBTTCAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"usdtToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}];
export const MBTTC_ABI: readonly any[] = [[{"inputs":[{"internalType":"address","name":"_admin","type":"address"},{"internalType":"address","name":"_vestingContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AccessControlBadConfirmation","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"neededRole","type":"bytes32"}],"name":"AccessControlUnauthorizedAccount","type":"error"},{"inputs":[],"name":"AddressZeroInvalid","type":"error"},{"inputs":[],"name":"BurnTaxExceedsCap","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[],"name":"EnforcedPause","type":"error"},{"inputs":[],"name":"ExpectedPause","type":"error"},{"inputs":[],"name":"SupplyCapExceeded","type":"error"},{"inputs":[],"name":"TradingAlreadyEnabled","type":"error"},{"inputs":[],"name":"TradingNotEnabledYet","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"pair","type":"address"},{"indexed":true,"internalType":"bool","name":"value","type":"bool"}],"name":"AMMPairSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldTaxBps","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTaxBps","type":"uint256"}],"name":"BurnTaxUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":true,"internalType":"bytes32","name":"category","type":"bytes32"}],"name":"CategoryMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"receiver","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"RewardMinted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"previousAdminRole","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"newAdminRole","type":"bytes32"}],"name":"RoleAdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleGranted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"role","type":"bytes32"},{"indexed":true,"internalType":"address","name":"account","type":"address"},{"indexed":true,"internalType":"address","name":"sender","type":"address"}],"name":"RoleRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensBurnedAuto","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"burner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"reason","type":"string"},{"indexed":true,"internalType":"bytes32","name":"category","type":"bytes32"}],"name":"TokensBurnedWithReason","type":"event"},{"anonymous":false,"inputs":[],"name":"TradingEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[],"name":"DEFAULT_ADMIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"LIQUIDITY_MANAGER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BURN_TAX_CAP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MINTER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PAUSER_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PLUGIN_ROLE","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SC_ALPHA_K3","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"activeHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"ammPairList","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"categoryMintedSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"delta_theta_mod","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"enableTrading","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getCirculatingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEnterpriseDashboard","outputs":[{"internalType":"string","name":"tokenName","type":"string"},{"internalType":"string","name":"tokenSymbol","type":"string"},{"internalType":"uint8","name":"tokenDecimals","type":"uint8"},{"internalType":"uint256","name":"maxSupply","type":"uint256"},{"internalType":"uint256","name":"currentSupply","type":"uint256"},{"internalType":"uint256","name":"remSupply","type":"uint256"},{"internalType":"uint256","name":"burnedSupply","type":"uint256"},{"internalType":"uint256","name":"totalHolderCount","type":"uint256"},{"internalType":"uint256","name":"activeHolderCount","type":"uint256"},{"internalType":"bool","name":"isTradingEnabled","type":"bool"},{"internalType":"bool","name":"isPaused","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLiquidityAnalytics","outputs":[{"internalType":"uint256","name":"totalPairs","type":"uint256"},{"internalType":"address[]","name":"pairs","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"}],"name":"getRoleAdmin","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTokenStatistics","outputs":[{"internalType":"uint256","name":"maxSupply","type":"uint256"},{"internalType":"uint256","name":"currentSupply","type":"uint256"},{"internalType":"uint256","name":"remSupply","type":"uint256"},{"internalType":"uint256","name":"burnedSupply","type":"uint256"},{"internalType":"bool","name":"isTradingEnabled","type":"bool"},{"internalType":"bool","name":"isPaused","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"hasRole","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"isAutomatedMarketMakerPair","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"category","type":"string"}],"name":"mintCategory","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mintReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"remainingSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"callerConfirmation","type":"address"}],"name":"renounceRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"revokeRole","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"pair","type":"address"},{"internalType":"bool","name":"value","type":"bool"}],"name":"setAutomatedMarketMakerPair","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newTaxBps","type":"uint256"}],"name":"setBurnTaxBps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBurnedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalHolders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMinted","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalMintedTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tradingEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"}]];
export const S4_ABI: readonly any[] = [];
export const STARTER_REWARD_ABI: readonly any[] = [];
export const LIQUIDITY_POOL_ABI: readonly any[] = [];
export const QUANTUM_NEXUS_ABI: readonly any[] = [];
export const NEXUS_PRIME_ABI: readonly any[] = [];
export const PREMIUM_REWARD_ABI: readonly any[] = [];
export const SALARY_ABI: readonly any[] = [];
export const TRADING_ROUTER_ABI: readonly any[] = [];
export const TRADING_PAIR_ABI: readonly any[] = [];

/**
 * Contract Status Model Across Ecosystem
 * Distinguishes deployment, configuration, verification, and launch states.
 */
export type ContractStatusState =
  | 'NOT_DEPLOYED'
  | 'DEPLOYED'
  | 'CONFIGURED'
  | 'VERIFIED'
  | 'ENABLED'
  | 'LIVE'
  | 'COMING_SOON'
  | 'LOCKED';

export interface ContractRegistryEntry {
  key: keyof typeof CONTRACT_ADDRESSES;
  name: string;
  role: string;
  phase: 1 | 2 | 3 | 4;
  address: string;
  abi: readonly any[];
  status: ContractStatusState;
  statusBadge: {
    label: string;
    iconColor: string;
    badgeBg: string;
    badgeBorder: string;
    symbol: '🟢' | '🟡' | '🔒';
  };
  description: string;
  isRealBlockchainVerified: boolean;
  explorerUrl: string | null;
}

/**
 * Enabled flags per contract module.
 * CRITICAL ARCHITECTURAL DISTINCTION:
 * isDeployed !== isLaunched
 * A contract may be deployed on-chain for auditing/testing, but remains locked in frontend
 * until its corresponding launch phase is officially activated.
 */
export const CONTRACT_ENABLED_FLAGS: Record<keyof typeof CONTRACT_ADDRESSES, boolean> = {
  mdefiHub: false,
  mbttcToken: false,
  s4Matrix: false,
  starterReward: false,
  liquidityPool: false,
  quantumNexus: false,
  nexusPrime: false,
  premiumReward: false,
  salaryContract: false,
  tradingRouter: false,
  tradingPair: false,
  treasuryIpo: false,
  burnDead: true,
  usdtBsc: true,
};

/**
 * Master Phase 1 Status
 */
export interface PhaseStatusInfo {
  phase: number;
  isPhaseGatedLive: boolean;
  isFullyLiveOnChain: boolean;
  mode: 'demo' | 'live';
  network: ContractDeploymentConfig;
}

export function getPhase1Status(): PhaseStatusInfo {
  const isHubDeployed = isContractDeployed('mdefiHub');
  const isMbttcDeployed = isContractDeployed('mbttcToken');
  const isFullyLiveOnChain = NETWORK_CONFIG.isDeployed && isHubDeployed && isMbttcDeployed;

  return {
    phase: 1,
    isPhaseGatedLive: true,
    isFullyLiveOnChain,
    mode: isFullyLiveOnChain ? 'live' : 'demo',
    network: NETWORK_CONFIG,
  };
}

export function getPhaseStatus(phase: 1 | 2 | 3 | 4): PhaseStatusInfo {
  const activeLaunchPhase = 1; // Synchronized with ACTIVE_LAUNCH_PHASE
  const isGatedLive = phase <= activeLaunchPhase;
  let isFullyLive = false;

  if (phase === 1) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('mdefiHub') && isContractDeployed('mbttcToken');
  } else if (phase === 2) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('s4Matrix') && isContractDeployed('starterReward');
  } else if (phase === 3) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('quantumNexus') && isContractDeployed('salaryContract');
  } else if (phase === 4) {
    isFullyLive = NETWORK_CONFIG.isDeployed && isContractDeployed('tradingRouter');
  }

  return {
    phase,
    isPhaseGatedLive: isGatedLive,
    isFullyLiveOnChain: isFullyLive,
    mode: isFullyLive ? 'live' : 'demo',
    network: NETWORK_CONFIG,
  };
}

/**
 * Determine dynamic status of a contract in the registry
 */
export function getContractStatus(contractKey: keyof typeof CONTRACT_ADDRESSES): ContractStatusState {
  // Auxiliary constants
  if (contractKey === 'burnDead' || contractKey === 'usdtBsc') {
    return 'VERIFIED';
  }

  const phaseMap: Record<keyof typeof CONTRACT_ADDRESSES, 1 | 2 | 3 | 4> = {
    mdefiHub: 1,
    mbttcToken: 1,
    s4Matrix: 2,
    starterReward: 2,
    liquidityPool: 2,
    quantumNexus: 3,
    nexusPrime: 3,
    premiumReward: 3,
    salaryContract: 3,
    tradingRouter: 4,
    tradingPair: 4,
    treasuryIpo: 2,
    burnDead: 1,
    usdtBsc: 1,
  };

  const targetPhase = phaseMap[contractKey] || 1;
  const activeLaunchPhase = 1; // Default to Phase 1 Launch

  // If the contract belongs to a future unlaunched phase
  if (targetPhase > activeLaunchPhase) {
    return 'COMING_SOON';
  }

  // Phase is currently active
  const address = CONTRACT_ADDRESSES[contractKey];
  const hasValidAddress = Boolean(address && address.startsWith('0x') && address.length === 42 && address !== CONTRACT_ADDRESSES.burnDead);

  if (!hasValidAddress) {
    return 'NOT_DEPLOYED';
  }

  const isEnabled = Boolean(CONTRACT_ENABLED_FLAGS[contractKey]);
  if (!isEnabled) {
    return 'DEPLOYED';
  }

  return 'LIVE';
}

/**
 * Comprehensive Smart Contract Registry List for Profile & Governance Transparency
 */
export function getContractRegistryList(): ContractRegistryEntry[] {
  const definitions: Array<{
    key: keyof typeof CONTRACT_ADDRESSES;
    name: string;
    role: string;
    phase: 1 | 2 | 3 | 4;
    abi: readonly any[];
    description: string;
  }> = [
    // Phase 1 Contracts
    {
      key: 'mdefiHub',
      name: 'MDeFi Core Hub',
      role: 'Master Protocol Router & On-Chain Lineage',
      phase: 1,
      abi: HUB_ABI,
      description: 'Decentralized member registration, dynamic network fee routing, and immutable sponsor linkage.',
    },
    {
      key: 'mbttcToken',
      name: 'MBTTC Token Contract',
      role: 'BEP-20 Native Community Token',
      phase: 1,
      abi: MBTTC_ABI,
      description: 'Fixed 2,000,000 MBTTC supply token contract governing airdrop minting, 4-hour claims, and burn cycles.',
    },
    // Phase 2 Contracts
    {
      key: 's4Matrix',
      name: 'S4 Matrix Contract',
      role: '2x2 Follow-Me Matrix Engine',
      phase: 2,
      abi: S4_ABI,
      description: 'Handles Junior ($10) & Senior ($25) nodes with 20% direct yield, 20% slot yield, and automated re-entry.',
    },
    {
      key: 'starterReward',
      name: 'Weekly Starter Reward Vault',
      role: 'Weekly Community Performance Pool',
      phase: 2,
      abi: STARTER_REWARD_ABI,
      description: 'Automated on-chain weekly reward distribution for qualified Senior Node partners.',
    },
    {
      key: 'liquidityPool',
      name: 'Protocol Liquidity Vault',
      role: 'Decentralized Liquidity Management',
      phase: 2,
      abi: LIQUIDITY_POOL_ABI,
      description: 'Treasury IPO liquidity reserves, USDT backing, and dynamic valuation bridge.',
    },
    // Phase 3 Contracts
    {
      key: 'quantumNexus',
      name: 'Quantum Node Matrix',
      role: '30-Position Ring Matrix ($70)',
      phase: 3,
      abi: QUANTUM_NEXUS_ABI,
      description: 'Deep 4-ring matrix with algorithmic spillover, team recycling, and generation yields.',
    },
    {
      key: 'nexusPrime',
      name: 'Nexus Prime Matrix',
      role: 'Elite Multi-Tier Matrix ($120)',
      phase: 3,
      abi: NEXUS_PRIME_ABI,
      description: 'High-performance matrix node unlocking 7-generation overrides and advanced protocol yields.',
    },
    {
      key: 'premiumReward',
      name: 'Weekly Premium Reward Vault',
      role: 'Leadership Community Performance Pool',
      phase: 3,
      abi: PREMIUM_REWARD_ABI,
      description: 'High-tier weekly reward distributions for qualified Quantum and Prime node holders.',
    },
    {
      key: 'salaryContract',
      name: 'Weekly Passive Salary Vault',
      role: 'Rank-Based Milestone Salary Engine',
      phase: 3,
      abi: SALARY_ABI,
      description: 'Direct smart contract payroll releasing verified weekly USDT salary disbursements.',
    },
    // Phase 4 Contracts
    {
      key: 'tradingRouter',
      name: 'PancakeSwap Trading Router',
      role: 'DEX Automated Market Maker',
      phase: 4,
      abi: TRADING_ROUTER_ABI,
      description: 'Decentralized BEP-20 swapping engine for instant MBTTC/USDT and MBTTC/BNB transactions.',
    },
    {
      key: 'tradingPair',
      name: 'MBTTC/USDT Liquidity Pair',
      role: 'Automated Liquidity Pool Pair',
      phase: 4,
      abi: TRADING_PAIR_ABI,
      description: 'Decentralized liquidity pool contract on BNB Smart Chain recording real-time market pricing.',
    },
  ];

  return definitions.map((item) => {
    const status = getContractStatus(item.key);
    const address = CONTRACT_ADDRESSES[item.key];
    const hasAddress = Boolean(address && address.startsWith('0x') && address.length === 42 && address !== CONTRACT_ADDRESSES.burnDead);

    let statusBadge: ContractRegistryEntry['statusBadge'];

    if (status === 'LIVE') {
      statusBadge = {
        label: 'VERIFIED ON-CHAIN',
        symbol: '🟢',
        iconColor: 'text-emerald-400',
        badgeBg: 'bg-emerald-950/70 text-emerald-300',
        badgeBorder: 'border-emerald-500/40',
      };
    } else if (status === 'DEPLOYED' || status === 'CONFIGURED') {
      statusBadge = {
        label: 'PENDING AUDIT & VERIFICATION',
        symbol: '🟡',
        iconColor: 'text-amber-400',
        badgeBg: 'bg-amber-950/70 text-amber-300',
        badgeBorder: 'border-amber-500/40',
      };
    } else if (status === 'COMING_SOON') {
      statusBadge = {
        label: `COMING SOON • PHASE ${item.phase}`,
        symbol: '🔒',
        iconColor: 'text-zinc-500',
        badgeBg: 'bg-zinc-900 text-zinc-400',
        badgeBorder: 'border-zinc-800',
      };
    } else {
      statusBadge = {
        label: 'NOT DEPLOYED • PENDING MAINNET',
        symbol: '🔒',
        iconColor: 'text-zinc-400',
        badgeBg: 'bg-zinc-900 text-zinc-300',
        badgeBorder: 'border-zinc-800',
      };
    }

    return {
      key: item.key,
      name: item.name,
      role: item.role,
      phase: item.phase,
      address: hasAddress ? address : '',
      abi: item.abi,
      status,
      statusBadge,
      description: item.description,
      isRealBlockchainVerified: status === 'LIVE',
      explorerUrl: hasAddress ? getExplorerAddressUrl(address) : null,
    };
  });
}

/**
 * Check whether the given contract key is deployed
 */
export function isContractDeployed(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!NETWORK_CONFIG.isDeployed) return false;
  if (!contractKey) return false;
  const addr = CONTRACT_ADDRESSES[contractKey];
  return Boolean(addr && addr.startsWith('0x') && addr.length === 42 && addr !== CONTRACT_ADDRESSES.burnDead);
}

/**
 * Check whether the given contract is both deployed and enabled
 */
export function isContractActive(contractKey?: keyof typeof CONTRACT_ADDRESSES): boolean {
  if (!isContractDeployed(contractKey)) return false;
  if (!contractKey) return false;
  return Boolean(CONTRACT_ENABLED_FLAGS[contractKey]);
}

/**
 * Returns the explorer link for an address, or null if address is undeployed / empty
 */
export function getExplorerAddressUrl(address?: string): string | null {
  if (!address || address.trim() === '' || !address.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/address/${address}`;
}

/**
 * Returns the explorer link for a tx hash, or null if empty
 */
export function getExplorerTxUrl(txHash?: string): string | null {
  if (!txHash || txHash.trim() === '' || !txHash.startsWith('0x')) {
    return null;
  }
  return `${NETWORK_CONFIG.explorerUrl}/tx/${txHash}`;
}
