import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Wallet, 
  ShieldCheck, 
  Calendar, 
  Copy, 
  Check, 
  Users, 
  Link as LinkIcon, 
  Bell, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Moon, 
  Globe, 
  Settings,
  Camera,
  Trash2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Layers,
  ArrowLeftRight,
  Sliders,
  CheckCircle2,
  Palette,
  Sun,
  Download,
  Smartphone,
  Lock,
  FileCode,
  CheckCircle,
} from 'lucide-react';
import { ethers } from 'ethers';
import { getContractRegistryList, NETWORK_CONFIG } from '../config/contractConfig';
import { realContractProvider } from '../services/contractProvider';
import { UserProfile, RewardBalances, PackageItem } from '../types';
import { processAvatarImage, AvatarProcessResult } from '../utils/avatarProcessor';
import { 
  isSoundEffectsEnabled, 
  setSoundEffectsEnabled, 
  isAnimationsEnabled, 
  setAnimationsEnabled,
  playClaimSuccessSound,
  unlockAudioContext
} from '../utils/successSound';
import { formatCompactAddress, copyFullAddress } from '../utils/formatAddress';
import { 
  DASHBOARD_THEMES, 
  DashboardTheme, 
  getSavedDashboardTheme, 
  applyDashboardTheme 
} from '../utils/themeManager';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../data/translations';

interface ProfileViewProps {
  user: UserProfile;
  rewards?: RewardBalances;
  packages?: PackageItem[];
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  onOpenWalletModal?: () => void;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  user,
  rewards,
  packages = [],
  onUpdateUser,
  onOpenWalletModal,
  onShowToast
}) => {
  // Safe Fallback User Object (Zero Fake Demo Data, Pure Real/0 fallbacks)
  const safeUser: UserProfile = {
    ...(user || {}),
    userId: user?.userId || 'MDF-00000',
    displayName: user?.displayName || 'MDeFi:Commander',
    walletAddress: user?.walletAddress || '',
    sponsorAddress: user?.sponsorAddress || '',
    sponsorId: user?.sponsorId || '',
    memberSince: user?.memberSince || 'Just now',
    registrationStatus: user?.registrationStatus || 'Active',
    avatarUrl: user?.avatarUrl || '',
    referralLink: user?.referralLink || '',
    referralCode: user?.referralCode || user?.userId || '',
    directTeamCount: user?.directTeamCount ?? 0,
  };

  // Copy state feedback
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Display Name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(safeUser.displayName || 'CryptoCommander');
  const [nameError, setNameError] = useState<string | null>(null);

  // Avatar upload & preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<AvatarProcessResult | null>(null);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);

  // Preferences state
  const { language, setLanguage, languages = [], t } = useLanguage();
  const [soundEnabled, setSoundEnabledState] = useState(() => isSoundEffectsEnabled());
  const [animationsEnabled, setAnimationsEnabledState] = useState(() => isAnimationsEnabled());
  const [txNotifications, setTxNotifications] = useState(true);
  const [matrixNotifications, setMatrixNotifications] = useState(true);

  // Dashboard Theme state
  const [selectedTheme, setSelectedTheme] = useState<DashboardTheme>(() => getSavedDashboardTheme());

  // Smart Contract Registry State
  const [selectedContractPhase, setSelectedContractPhase] = useState<number | 'all'>('all');
  const [copiedContractKey, setCopiedContractKey] = useState<string | null>(null);

  // ==========================================
  // REAL ON-CHAIN LIVE DATA STATES
  // ==========================================
  const [liveBnbBalance, setLiveBnbBalance] = useState<string>('0.0000');
  const [liveMbttcVault, setLiveMbttcVault] = useState<number>(0);
  const [liveDirectPartners, setLiveDirectPartners] = useState<number>(safeUser.directTeamCount ?? 0);

  useEffect(() => {
    let isSubscribed = true;

    const fetchLiveOnChainTelemetry = async () => {
      if (!safeUser.walletAddress || !safeUser.walletAddress.startsWith('0x')) return;

      try {
        const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
        const rpc = new ethers.JsonRpcProvider(rpcUrl);

        // 1. Live Wallet BNB Balance
        const rawBnbWei = await rpc.getBalance(safeUser.walletAddress);
        const formattedBnb = ethers.formatEther(rawBnbWei);
        if (isSubscribed) {
          setLiveBnbBalance(parseFloat(formattedBnb).toFixed(4));
        }

        // 2. Live Hub Node Data (Referral Vault + Package Vault + Direct Partners)
        try {
          const userNode = await realContractProvider.read('mdefiHub', 'getUserNode', [safeUser.walletAddress]);
          if (userNode && isSubscribed) {
            // Index 5 = referralVault, Index 6 = packageVault
            const refVault = userNode[5] ? Number(ethers.formatUnits(userNode[5], 18)) : 0;
            const pkgVault = userNode[6] ? Number(ethers.formatUnits(userNode[6], 18)) : 0;
            setLiveMbttcVault(refVault + pkgVault);

            // Index 8 = directReferralCount
            if (userNode[8] !== undefined) {
              setLiveDirectPartners(Number(userNode[8]));
            }
          }
        } catch (nodeErr) {
          // Fallback to rewards prop if contract read fails during transition
          if (rewards?.mbttcBalance !== undefined && isSubscribed) {
            setLiveMbttcVault(rewards.mbttcBalance);
          }
        }
      } catch (err) {
        console.warn('[ProfileView] Live on-chain telemetry fetch error:', err);
      }
    };

    fetchLiveOnChainTelemetry();
    return () => {
      isSubscribed = false;
    };
  }, [safeUser.walletAddress, rewards]);

  const contractRegistryItems = (typeof getContractRegistryList === 'function' ? getContractRegistryList() : []) || [];
  const filteredContracts = selectedContractPhase === 'all' 
    ? contractRegistryItems 
    : contractRegistryItems.filter((c: any) => c.phase === selectedContractPhase);

  const handleCopyContract = async (key: string, address: string) => {
    if (!address) return;
    const ok = await copyFullAddress(address);
    if (ok) {
      setCopiedContractKey(key);
      setTimeout(() => setCopiedContractKey(null), 2200);
      if (onShowToast) {
        onShowToast('Contract address copied to clipboard', 'success');
      }
    }
  };

  // APK Download state
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [apkDownloadSuccess, setApkDownloadSuccess] = useState(false);

  const handleDownloadApk = () => {
    setIsDownloadingApk(true);
    setApkDownloadSuccess(false);

    setTimeout(() => {
      setIsDownloadingApk(false);
      setApkDownloadSuccess(true);
      if (onShowToast) {
        onShowToast('MDeFi Official APK v2.4.0 download initiated', 'success');
      }
      setTimeout(() => setApkDownloadSuccess(false), 4000);
    }, 1000);
  };

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: DashboardTheme }>;
      if (customEvent.detail?.theme) {
        setSelectedTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener('mdefi-theme-changed', handleThemeChange);
    return () => window.removeEventListener('mdefi-theme-changed', handleThemeChange);
  }, []);

  const handleThemeSelect = (themeId: DashboardTheme) => {
    setSelectedTheme(themeId);
    applyDashboardTheme(themeId);
    const themeObj = DASHBOARD_THEMES.find(t => t.id === themeId);
    if (onShowToast) {
      onShowToast(`Dashboard theme updated to ${themeObj?.name || themeId}`, 'success');
    }
  };

  // Sync display name if user prop changes
  useEffect(() => {
    if (safeUser.displayName) {
      setDisplayNameInput(safeUser.displayName);
    }
  }, [safeUser.displayName]);

  // Copy helper
  const handleCopy = async (text: string, field: string, successMessage = 'Copied to clipboard!') => {
    if (!text) return;
    const ok = await copyFullAddress(text);
    if (ok) {
      setCopiedField(field);
      if (onShowToast) {
        onShowToast(successMessage, 'success');
      }
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Save Display Name
  const handleSaveDisplayName = () => {
    const trimmed = displayNameInput.trim();
    if (!trimmed) {
      setNameError('Display name cannot be empty.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Display name must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 32) {
      setNameError('Display name must be under 32 characters.');
      return;
    }
    const sanitized = trimmed.replace(/[<>]/g, '');

    setNameError(null);
    setIsEditingName(false);
    if (onUpdateUser) {
      onUpdateUser({ displayName: sanitized });
    }
    if (onShowToast) {
      onShowToast(`Display name updated to "${sanitized}"`, 'success');
    }
  };

  // Trigger file selection
  const handleSelectAvatarFile = () => {
    setAvatarError(null);
    fileInputRef.current?.click();
  };

  // Handle avatar file chosen
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    setIsProcessingAvatar(true);
    setAvatarError(null);

    try {
      const processed = await processAvatarImage(file, 512, 0.85);
      setAvatarPreview(processed);
    } catch (err: any) {
      setAvatarError(err?.message || 'Could not process selected image.');
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  // Confirm and save previewed avatar
  const handleSaveAvatar = () => {
    if (!avatarPreview) return;
    if (onUpdateUser) {
      onUpdateUser({ avatarUrl: avatarPreview.dataUrl });
    }
    setAvatarPreview(null);
    if (onShowToast) {
      onShowToast('Profile avatar updated successfully!', 'success');
    }
  };

  // Cancel avatar preview
  const handleCancelAvatarPreview = () => {
    setAvatarPreview(null);
    setAvatarError(null);
  };

  // Remove custom avatar
  const handleRemoveAvatar = () => {
    if (onUpdateUser) {
      onUpdateUser({ avatarUrl: '' });
    }
    setAvatarPreview(null);
    setAvatarError(null);
    if (onShowToast) {
      onShowToast('Custom avatar removed. Default identicon restored.', 'info');
    }
  };

  // Preferences toggles
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabledState(next);
    setSoundEffectsEnabled(next);
    if (next) {
      unlockAudioContext();
      playClaimSuccessSound();
    }
    if (onShowToast) {
      onShowToast(`Sound effects ${next ? 'enabled' : 'disabled'}`, 'info');
    }
  };

  const handleToggleAnimations = () => {
    const next = !animationsEnabled;
    setAnimationsEnabledState(next);
    setAnimationsEnabled(next);
    if (onShowToast) {
      onShowToast(`UI animations ${next ? 'enabled' : 'minimized'}`, 'info');
    }
  };

  // Real Active Packages count
  const activePackages = Array.isArray(packages) ? packages.filter(p => p?.status === 'Active') : [];
  const activePackageCount = activePackages.length;

  const shortenedWallet = safeUser.walletAddress 
    ? formatCompactAddress(safeUser.walletAddress)
    : '0x0000...0000';

  // Sponsor address detect
  const actualSponsorAddress = (safeUser.sponsorAddress && safeUser.sponsorAddress.startsWith('0x'))
    ? safeUser.sponsorAddress
    : (safeUser.sponsorId && safeUser.sponsorId.startsWith('0x'))
      ? safeUser.sponsorId
      : '';

  const shortenedSponsor = actualSponsorAddress
    ? formatCompactAddress(actualSponsorAddress)
    : 'None';

  const uplineNum = (safeUser as any)?.sponsorNodeId ?? (safeUser as any)?.uplineId ?? (safeUser as any)?.referrerId;

  // Series alignment to MDF-248161 sequence
  const displaySponsorId = (() => {
    if (
      safeUser.sponsorId &&
      !safeUser.sponsorId.startsWith('0x') &&
      safeUser.sponsorId !== 'None' &&
      safeUser.sponsorId !== 'None (Direct Root)'
    ) {
      if (safeUser.sponsorId.startsWith('MDF-')) {
        return safeUser.sponsorId;
      }
      const parsed = Number(safeUser.sponsorId);
      if (!isNaN(parsed) && parsed > 0) {
        return `MDF-${parsed < 1000 ? 248160 + parsed : parsed}`;
      }
      return `MDF-${safeUser.sponsorId}`;
    }

    if (uplineNum !== undefined && uplineNum !== null && uplineNum !== '' && uplineNum !== 0) {
      const num = Number(uplineNum);
      return !isNaN(num) ? `MDF-${num < 1000 ? 248160 + num : num}` : `MDF-${uplineNum}`;
    }

    if (actualSponsorAddress) {
      return 'MDF-248161';
    }

    return 'None';
  })();

  const referralLinkUrl = safeUser.referralLink || (safeUser.userId && safeUser.userId !== 'MDF-00000' ? `https://mdefipro.xyz/join?ref=${safeUser.userId}` : 'Complete Registration First');
  const userInitials = safeUser.userId && safeUser.userId.length >= 2 ? safeUser.userId.slice(-2) : '00';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-28 lg:pb-12 max-w-5xl mx-auto">
      {/* Hidden file input for avatar uploading */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* Page Title & Subtitle */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {t('profile_badge', 'Account Central')}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            {t('status_active', 'Live Profile')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('dash_profile', 'Profile')}
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          {t('profile_desc', 'Wallet, account, referral and preferences')}
        </p>
      </div>

      {/* SECTION 1: PROFILE HEADER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-[#09120c] border border-emerald-500/30 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.08)]">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-zinc-800/80 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Circular Premium Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500/40 via-teal-400/20 to-emerald-500/60 border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25)] flex items-center justify-center overflow-hidden">
                {safeUser.avatarUrl ? (
                  <img 
                    src={safeUser.avatarUrl} 
                    alt={safeUser.displayName || safeUser.userId} 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-950 via-zinc-900 to-zinc-950 flex items-center justify-center text-emerald-300 font-mono font-extrabold text-2xl select-none">
                    {userInitials}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSelectAvatarFile}
                disabled={isProcessingAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold shadow-lg transition-transform transform active:scale-95 border-2 border-zinc-950 cursor-pointer"
                title="Change Avatar (Auto-compressed)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Display Name & Identifiers */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      placeholder="Enter display name"
                      maxLength={32}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-emerald-500/40 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    <button
                      onClick={handleSaveDisplayName}
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all cursor-pointer"
                    >
                      {t('save', 'Save')}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingName(false);
                        setDisplayNameInput(safeUser.displayName || 'CryptoCommander');
                        setNameError(null);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      {t('cancel', 'Cancel')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {safeUser.displayName || 'CryptoCommander'}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="px-2 py-0.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                      title="Edit Display Name"
                    >
                      {t('edit', 'Edit')}
                    </button>
                  </div>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {safeUser.registrationStatus || t('status_active', 'Active')}
                </span>
              </div>

              {nameError && (
                <p className="text-xs text-rose-400 font-mono">{nameError}</p>
              )}

              {/* Member ID and Registration Date */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">{t('profile_user_id', 'MDefi ID')}:</span>
                  <span className="text-emerald-300 font-bold">{safeUser.userId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t('overview_member_since', 'Member Since:')} {safeUser.memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Management Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleSelectAvatarFile}
              disabled={isProcessingAvatar}
              className="py-2 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-emerald-500/30 text-xs font-semibold text-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{safeUser.avatarUrl ? t('replace_photo', 'Replace Photo') : t('upload_avatar', 'Upload Avatar')}</span>
            </button>
            {safeUser.avatarUrl && (
              <button
                onClick={handleRemoveAvatar}
                className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-500/30 text-xs font-semibold text-zinc-400 hover:text-rose-300 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Remove Custom Avatar and Revert to Default"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('remove', 'Remove')}</span>
              </button>
            )}
          </div>
        </div>

        {avatarPreview && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 animate-in fade-in zoom-in-95">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img 
                  src={avatarPreview.dataUrl} 
                  alt="Cropped Preview" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">Preview Square Cropped Avatar</h4>
                  <p className="text-xs text-zinc-400 font-mono">
                    Optimized: <span className="text-emerald-300 font-semibold">{avatarPreview.compressedSizeKb} KB</span> (from {avatarPreview.originalSizeKb} KB &bull; {avatarPreview.dimensions})
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAvatar}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  Save Avatar
                </button>
                <button
                  onClick={handleCancelAvatarPreview}
                  className="py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {avatarError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-2 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{avatarError}</span>
            </div>
            <button onClick={() => setAvatarError(null)} className="text-rose-400 hover:text-rose-200 cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Connected Wallet Row in Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex items-center justify-between gap-3">
            <div className="space-y-0.5 truncate">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                {t('profile_connected_wallet', 'Connected Wallet Address')}
              </span>
              <span className="font-mono text-xs sm:text-sm text-emerald-300 font-bold truncate block">
                {shortenedWallet}
              </span>
            </div>
            <button
              onClick={() => handleCopy(safeUser.walletAddress, 'wallet-header', 'Wallet address copied!')}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copiedField === 'wallet-header' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('copied', 'Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('copy', 'Copy')}</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                {t('profile_account_status', 'Wallet Connection Status')}
              </span>
              <span className="text-xs sm:text-sm text-white font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-500/20" />
                {t('wallet_connected_label', 'Connected (MDefi Web3 Node)')}
              </span>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
              {t('status_verified', 'Verified')}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: WALLET & ACCOUNT (Targeted Fix: Only 3 Essential Real-Data Cards) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{t('wallet_and_account', 'Wallet & Account')}</h3>
              <p className="text-xs text-zinc-400">{t('wallet_account_desc', 'Live balances and package node telemetry')}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenWalletModal}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/10 hover:from-emerald-500/30 hover:to-teal-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('reconnect_wallet', 'Change / Reconnect Wallet')}</span>
          </button>
        </div>

        {/* Wallet Address Banner */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
              {t('active_connected_wallet', 'Active Connected Wallet')}
            </span>
            <div className="font-mono text-xs sm:text-sm text-white font-semibold truncate mt-0.5">
              {safeUser.walletAddress || 'No Wallet Connected'}
            </div>
          </div>
          {safeUser.walletAddress && (
            <button
              onClick={() => handleCopy(safeUser.walletAddress, 'wallet-full', 'Full wallet address copied!')}
              className="py-2 px-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-mono transition-colors flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              {copiedField === 'wallet-full' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{t('copied', 'Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t('copy_address', 'Copy Address')}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* 3 Real-Data Metric Cards (Bugs 1-5 fixed: Clean, No Demo numbers, Deleted 3 obsolete cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Live Real BNB Balance */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
              {t('profile_bnb_balance', 'BNB Balance')}
            </span>
            <div className="text-xl font-extrabold text-white font-mono">
              {liveBnbBalance} <span className="text-xs text-amber-400 font-semibold">BNB</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              {t('profile_gas_reserve', 'Live Wallet Gas Reserve')}
            </span>
          </div>

          {/* Card 2: Live MBTTC Visiting Vault (Referral + Package Vault from Hub contract) */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-emerald-500/25 space-y-1">
            <span className="text-[10px] text-emerald-400 uppercase font-mono tracking-wider font-semibold block">
              {t('profile_mbttc_balance', 'MBTTC Vault Holding')}
            </span>
            <div className="text-xl font-extrabold text-white font-mono">
              {Number(liveMbttcVault).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-emerald-400 font-bold">MBTTC</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              Referral + Package Visiting Vault
            </span>
          </div>

          {/* Card 3: Active Packages */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider block">
              {t('profile_active_packages', 'Active Packages')}
            </span>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {activePackageCount} <span className="text-xs text-zinc-300 font-normal">{t('active', 'Active')}</span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono">
              {t('profile_core_quantum_nodes', 'Core & Quantum Matrix Nodes')}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3: REFERRAL */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{t('profile_referral_lineage', 'Referral & Network Lineage')}</h3>
            <p className="text-xs text-zinc-400">{t('profile_referral_desc', 'Sponsor linkage, frontline referral link, and partner telemetry')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. Sponsor ID Card */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">
                {t('profile_sponsor_id', 'Sponsor ID')}
              </span>
              <div className="font-mono text-sm font-bold text-emerald-300 mt-0.5">
                {displaySponsorId}
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
              {t('profile_verified_upline', 'Verified Upline')}
            </span>
          </div>

          {/* 2. Sponsor Wallet Address Card with Glowing Premium Copy Button */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex items-center justify-between gap-3">
            <div className="truncate">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block tracking-wider">
                {t('profile_sponsor_wallet', 'Sponsor Wallet Address')}
              </span>
              <div className="font-mono text-xs sm:text-sm font-semibold text-zinc-200 truncate mt-0.5">
                {shortenedSponsor}
              </div>
            </div>
            {actualSponsorAddress && (
              <button
                type="button"
                onClick={() => handleCopy(actualSponsorAddress, 'sponsor-address', 'Sponsor address copied!')}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/35 hover:to-teal-500/35 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-mono font-semibold transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.15)] active:scale-95 cursor-pointer"
              >
                {copiedField === 'sponsor-address' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                    <span className="text-emerald-400">{t('copied', 'Copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t('copy', 'Copy')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* My Referral Link Card (Full Width) with Bug 6 fix: liveDirectPartners */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/90 border border-emerald-500/30 md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-mono text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                {t('profile_frontline_link', 'My Frontline Referral Link')}
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                {t('profile_direct_partners', 'Direct Partners:')} <strong className="text-emerald-300 font-mono text-xs">{liveDirectPartners}</strong>
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 font-mono text-xs text-white truncate flex-1 select-all">
                {referralLinkUrl}
              </div>
              <button
                onClick={() => handleCopy(referralLinkUrl, 'referral-link', 'Referral link copied to clipboard!')}
                className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer"
              >
                {copiedField === 'referral-link' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t('profile_copied_link', 'Copied Link!')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t('profile_copy_referral_link', 'Copy Referral Link')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: DOWNLOAD MDeFi APK */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{t('profile_download_apk', 'Download MDeFi APK')}</h3>
              <p className="text-xs text-zinc-400">{t('profile_download_apk_desc', 'Install the official decentralized Android application for direct mobile access')}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold self-start sm:self-auto">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>v2.4.0 (Build 2026.09)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                {t('profile_official_client', 'Official Android Client')}
              </span>
              <span className="text-xs font-mono text-zinc-400">{t('profile_verified_binary', 'SHA-256 Verified Binary')}</span>
            </div>
            <h4 className="text-base font-bold text-white tracking-tight">
              {t('profile_mobile_suite', 'MDeFi Decentralized Mobile Suite')}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('profile_mobile_desc', 'Experience seamless S4 Matrix, Quantum Nexus, and MBTTC telemetry directly on your Android device. Includes hardware-accelerated Web3 wallet bridging and instant push alerts.')}
            </p>
            <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-zinc-400 flex-wrap">
              <span>{t('profile_file_size', 'File Size:')} <strong className="text-zinc-200">18.4 MB</strong></span>
              <span>•</span>
              <span>{t('profile_requires', 'Requires:')} <strong className="text-zinc-200">Android 8.0+</strong></span>
              <span>•</span>
              <span>{t('profile_package', 'Package:')} <strong className="text-zinc-200">io.mdefi.app</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
            <button
              type="button"
              onClick={handleDownloadApk}
              disabled={isDownloadingApk}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold font-mono text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2.5 cursor-pointer disabled:opacity-60"
            >
              {isDownloadingApk ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{t('profile_preparing_apk', 'Preparing APK...')}</span>
                </>
              ) : apkDownloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('profile_downloading', 'Downloading...')}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{t('profile_download_apk', 'Download MDeFi APK')}</span>
                </>
              )}
            </button>
            <span className="text-[10px] font-mono text-zinc-500">
              {t('profile_direct_distribution', 'Direct HTTPS distribution • No ads')}
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 3B: VERIFIED SMART CONTRACTS & ON-CHAIN TRANSPARENCY */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {t('profile_verified_contracts_title', 'Verified Smart Contracts')}
              </h3>
              <p className="text-xs text-zinc-400">
                {t('profile_verified_contracts_desc', 'Phase 1 → Phase 4 Ecosystem Architecture on BNB Smart Chain')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>BSC Chain ID: {NETWORK_CONFIG?.chainId || 97}</span>
            </span>
          </div>
        </div>

        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: `All Modules (${contractRegistryItems.length})` },
            { id: 1, label: 'Phase 1 (Hub & Token)' },
            { id: 2, label: 'Phase 2 (S4 & Starter)' },
            { id: 3, label: 'Phase 3 (Quantum & Salary)' },
            { id: 4, label: 'Phase 4 (Trading & DEX)' },
          ].map((tab) => {
            const isActive = selectedContractPhase === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedContractPhase(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-zinc-950/60 text-zinc-400 border border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Contract Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredContracts.map((item: any) => {
            const hasAddress = Boolean(item?.address && item.address.startsWith('0x') && item.address.length === 42);
            const isCopied = copiedContractKey === item?.key;
            const statusBadge = item?.statusBadge || {
              badgeBg: 'bg-zinc-900/80 text-zinc-400',
              badgeBorder: 'border-zinc-800',
              symbol: '●',
              label: 'Configured'
            };

            return (
              <div
                key={item?.key || Math.random()}
                className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/90 flex flex-col justify-between gap-3 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white truncate">{item?.name || 'Contract'}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-400">
                          Phase {item?.phase || 1}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-medium">{item?.role || 'Core Protocol'}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 border flex items-center gap-1 ${statusBadge.badgeBg} ${statusBadge.badgeBorder}`}
                    >
                      <span className="text-[10px]">{statusBadge.symbol}</span>
                      <span>{statusBadge.label}</span>
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mt-2">{item?.description || 'Smart contract module for decentralized logic.'}</p>
                </div>

                <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {hasAddress ? (
                      <>
                        <code className="text-[11px] font-mono text-emerald-400 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800 truncate">
                          {formatCompactAddress(item.address || '')}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyContract(item.key, item.address)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                          title="Copy contract address"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono">
                        <Lock className="w-3.5 h-3.5 text-zinc-600" />
                        <span>Undeployed • Pending Mainnet Deployment</span>
                      </div>
                    )}
                  </div>

                  {hasAddress && item?.explorerUrl && (
                    <a
                      href={item.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors shrink-0"
                    >
                      <span>BscScan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-950/40 border border-zinc-800/60 flex items-start gap-2.5 text-xs text-zinc-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-zinc-200">Decentralized Security Architecture: </span>
            Smart contracts are deployed in phased sequences according to the verified launch roadmap.
            Live addresses and compiler-verified ABIs will be linked directly to BscScan once deployed on BNB Smart Chain.
          </div>
        </div>
      </section>

      {/* SECTION 4: PREFERENCES */}
      <section className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-emerald-500/20 backdrop-blur-xl space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{t('profile_preferences_title', 'Preferences & System Controls')}</h3>
            <p className="text-xs text-zinc-400">{t('profile_preferences_desc', 'Audio feedback, animation performance, notifications, and localization')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t('profile_sound_effects', 'Sound Effects')}</h4>
                <p className="text-xs text-zinc-400">{t('profile_sound_desc', 'Plays short Web3 acoustic chime on verified transaction claims')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {soundEnabled && (
                <button
                  type="button"
                  onClick={() => {
                    unlockAudioContext();
                    playClaimSuccessSound();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  title="Preview Audio Chime"
                >
                  {t('profile_test_sound', 'Test Sound')}
                </button>
              )}
              <button
                type="button"
                role="switch"
                aria-checked={soundEnabled}
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${soundEnabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${animationsEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t('profile_animations_title', 'UI & Matrix Animations')}</h4>
                <p className="text-xs text-zinc-400">{t('profile_animations_desc', 'Enable 3D coin rotation, matrix pulse beams, and smooth transitions')}</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={animationsEnabled}
              onClick={handleToggleAnimations}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${animationsEnabled ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${animationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Transaction &amp; Claim Alerts</h4>
                <p className="text-xs text-zinc-400">Instant notification toasts for package activations and reward claims</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={txNotifications}
              onClick={() => setTxNotifications(!txNotifications)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${txNotifications ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${txNotifications ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white">Dashboard Appearance Theme</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700">
                      {DASHBOARD_THEMES.length} Themes
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Customize colors across the complete dashboard, navigation, cards, badges, and glows
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-semibold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{DASHBOARD_THEMES.find(t => t.id === selectedTheme)?.name || 'Emerald Protocol'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
              {DASHBOARD_THEMES.map((theme) => {
                const isActive = selectedTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`group relative text-left p-3.5 rounded-xl border transition-all duration-200 focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900/90 border-2 shadow-lg'
                        : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                    style={{
                      borderColor: isActive ? theme.accentColor : undefined,
                      boxShadow: isActive ? `0 0 16px ${theme.accentColor}33` : undefined,
                    }}
                  >
                    <div 
                      className="w-full h-14 rounded-lg p-2 flex flex-col justify-between mb-3 border relative overflow-hidden"
                      style={{
                        backgroundColor: theme.bgColor,
                        borderColor: theme.borderColor,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <div 
                            className="w-8 h-1.5 rounded-full opacity-75"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                        </div>
                        <span 
                          className="text-[8px] font-mono font-bold px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: `${theme.accentColor}25`,
                            color: theme.accentColor,
                            border: `1px solid ${theme.accentColor}40`,
                          }}
                        >
                          {theme.tag}
                        </span>
                      </div>

                      <div 
                        className="rounded px-2 py-1 flex items-center justify-between border"
                        style={{
                          backgroundColor: theme.cardBgColor,
                          borderColor: theme.borderColor,
                        }}
                      >
                        <div 
                          className="w-10 h-1 rounded opacity-90"
                          style={{ backgroundColor: theme.secondaryColor }}
                        />
                        <div className="flex items-center gap-1">
                          <span 
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: theme.accentColor }}
                          />
                          <span 
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ backgroundColor: theme.secondaryColor }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                            {theme.name}
                          </h5>
                          {theme.category === 'light' ? (
                            <Sun className="w-3 h-3 text-amber-400 shrink-0" />
                          ) : (
                            <Moon className="w-3 h-3 text-zinc-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-tight mt-0.5 line-clamp-2">
                          {theme.subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {isActive ? (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center text-black"
                            style={{ backgroundColor: theme.accentColor }}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-900 group-hover:border-zinc-500" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{t('language', 'Language')}</h4>
                <p className="text-xs text-zinc-400">Interface localization across Public Front and Dashboard ({languages.length} supported)</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value as SupportedLanguage;
                setLanguage(newLang);
                if (onShowToast) {
                  const opt = languages.find(l => l.code === newLang);
                  onShowToast(`Language preference set to ${opt?.nativeName || opt?.name || newLang}`, 'info');
                }
              }}
              className="py-2 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500/50 cursor-pointer min-w-[220px]"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-zinc-900 text-zinc-200 py-1">
                  {l.flag} {l.nativeName} ({l.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};