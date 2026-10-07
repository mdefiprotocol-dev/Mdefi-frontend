import React, { useState, useEffect, useRef } from 'react';

import { CosmicBackground } from './CosmicBackground';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { EcosystemSection } from './EcosystemSection';
import { CommunityRecentActivitySection } from './CommunityRecentActivitySection';
import { MbttcAirdropSection } from './MbttcAirdropSection';
import { MbttcTokenSection } from './MbttcTokenSection';
import { TokenomicsSection } from './TokenomicsSection';
import { MintingPhasesSection } from './MintingPhasesSection';
import { BurnDeflationSection } from './BurnDeflationSection';
import { WhyMbttcSection } from './WhyMbttcSection';
import { HowItWorksSection } from './HowItWorksSection';
import { ExchangeLaunchSection } from './ExchangeLaunchSection';
import { RoadmapSection } from './RoadmapSection';
import { FaqSection } from './FaqSection';
import { FinalRegistrationCta } from './FinalRegistrationCta';
import { LandingFooter } from './LandingFooter';
import { CommunityRatingSection } from '../CommunityRatingSection';

// Modals & Authentication Flows
import { WalletModal } from '../WalletModal';
import { RegisterModal } from '../auth/RegisterModal';
import { RegistrationCelebration } from '../auth/RegistrationCelebration';
import { SystemApprovalsModal } from '../auth/SystemApprovalsModal';
import { SocialCommunityModal } from '../auth/SocialCommunityModal';
import { LoginModal } from '../auth/LoginModal';
import { LegalDocsModal, LegalDocType } from '../auth/LegalDocsModal';
import { PhaseLockedView } from '../common/PhaseLockedView';

import { programPhaseService } from '../../services/programPhaseService';
import {
  LaunchPhase,
  LaunchModuleKey,
  MODULE_LAUNCH_DEFINITIONS,
} from '../../config/launchPhaseConfig';

import {
  extractReferralCodeFromUrl,
  clearReferralParamFromUrl,
} from '../../utils/referralUtils';

import { contractAdapter } from '../../services/contractAdapter';

import { X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (
    user?: {
      userId: string;
      sponsorId: string;
      walletAddress: string;
      isNewRegistration?: boolean;
    }
  ) => void;
}

/**
 * ---------------------------------------------------------
 * LOGIN FLOW PERSISTENCE
 * ---------------------------------------------------------
 * This is only used to recover the login flow if the browser
 * temporarily leaves/reloads the public page during wallet
 * connection, especially on tablet/mobile wallet apps.
 */
const LOGIN_FLOW_STORAGE_KEY = 'mdefi_login_flow';

type LoginFlowStage =
  | 'wallet'
  | 'checking'
  | 'connected'
  | 'login'
  | 'register';

interface LoginFlowState {
  action: 'login';
  stage: LoginFlowStage;
  walletAddress?: string;
}

const isValidWalletAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
}) => {
  // -------------------------------------------------------
  // WEB3 WALLET STATE
  // -------------------------------------------------------

  const [showWalletModal, setShowWalletModal] = useState(false);

  const [walletModalAction, setWalletModalAction] = useState<
    'register' | 'login' | 'general'
  >('register');

  const [connectedWallet, setConnectedWallet] = useState<string>('');

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // -------------------------------------------------------
  // AUTH FLOW TRANSITION STATE
  // -------------------------------------------------------
  // Prevents public landing page flash while wallet/login
  // state is being resolved.
  const [authTransitioning, setAuthTransitioning] = useState(false);

  const authTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Prevents duplicate wallet/login callbacks.
  const loginFlowLockRef = useRef(false);

  // -------------------------------------------------------
  // STATUS NOTIFICATION
  // -------------------------------------------------------

  const [statusNotice, setStatusNotice] = useState<{
    message: string;
    type: 'info' | 'warning' | 'success';
  } | null>(null);

  // -------------------------------------------------------
  // REFERRAL ENTRY CONTEXT
  // -------------------------------------------------------

  const [referralSponsorId, setReferralSponsorId] = useState<string | null>(
    () => {
      return extractReferralCodeFromUrl();
    }
  );

  // -------------------------------------------------------
  // AUTHENTICATION FLOW MODALS
  // -------------------------------------------------------

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showCelebration, setShowCelebration] = useState(false);
  const [showSystemApprovals, setShowSystemApprovals] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  // -------------------------------------------------------
  // PHASE LOCK MODAL
  // -------------------------------------------------------

  const [lockedModalData, setLockedModalData] = useState<{
    isOpen: boolean;
    moduleKey?: LaunchModuleKey;
    requiredPhase: LaunchPhase;
    customTitle?: string;
    customDescription?: string;
  }>({
    isOpen: false,
    requiredPhase: 2,
  });

  // -------------------------------------------------------
  // LEGAL DOCS
  // -------------------------------------------------------

  const [showLegalDocs, setShowLegalDocs] = useState(false);

  const [currentDocType, setCurrentDocType] =
    useState<LegalDocType>('risk');

  // -------------------------------------------------------
  // REGISTERED USER CONTEXT
  // -------------------------------------------------------

  const [registeredUser, setRegisteredUser] = useState<{
    userId: string;
    sponsorId: string;
    walletAddress: string;
  }>({
    userId: '',
    sponsorId: '',
    walletAddress: '',
  });

  // -------------------------------------------------------
  // SESSION STORAGE HELPERS
  // -------------------------------------------------------

  const saveLoginFlow = (
    stage: LoginFlowStage,
    walletAddress?: string
  ) => {
    try {
      const data: LoginFlowState = {
        action: 'login',
        stage,
        walletAddress: walletAddress || '',
      };

      sessionStorage.setItem(
        LOGIN_FLOW_STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch {
      // Ignore storage errors.
    }
  };

  const clearLoginFlow = () => {
    try {
      sessionStorage.removeItem(LOGIN_FLOW_STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  };

  const readLoginFlow = (): LoginFlowState | null => {
    try {
      const raw = sessionStorage.getItem(LOGIN_FLOW_STORAGE_KEY);

      if (!raw) return null;

      const parsed = JSON.parse(raw) as LoginFlowState;

      if (parsed?.action !== 'login') {
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  };

  // -------------------------------------------------------
  // ON-CHAIN REGISTRATION CHECK (Fast Single-Source Authoritative)
  // -------------------------------------------------------

  // -------------------------------------------------------
  // ON-CHAIN REGISTRATION CHECK (Fast Single-Source Authoritative)
  // -------------------------------------------------------

  const checkRegistrationStatus = async (
    address: string
  ): Promise<boolean> => {
    if (!address) return false;

    const clean = address.trim().toLowerCase();

    if (!isValidWalletAddress(clean)) {
      return false;
    }

    try {
      // 1. Primary check: getHubUserData (getUserDashboard tuple)
      const dash: any = await contractAdapter.getHubUserData(clean).catch(() => null);

      if (dash) {
        const hasValidAddress = Boolean(dash.walletAddress && dash.walletAddress.toLowerCase() === clean);
        const numericId = Number(dash.numericId ?? 0);
        const regTime = Number(dash.registrationTimestamp ?? 0);

        if (hasValidAddress || numericId > 0 || regTime > 0) {
          return true;
        }
      }

      // 2. Safe fallback: getHubUserNode
      const node: any = await contractAdapter.getHubUserNode(clean).catch(() => null);
      if (node) {
        const nodeNumId = Number(node.id || 0);
        const isRegistered = Boolean(node.isRegistered);
        const nodeWalletMatch = Boolean(node.wallet && node.wallet.toLowerCase() === clean);

        if (isRegistered || nodeNumId > 0 || nodeWalletMatch) {
          return true;
        }
      }

      return false;
    } catch {
      return false;
    }
  };

  // -------------------------------------------------------
  // AUTH TRANSITION CLEANUP
  // -------------------------------------------------------

  const stopAuthTransition = () => {
    if (authTransitionTimerRef.current) {
      clearTimeout(authTransitionTimerRef.current);
      authTransitionTimerRef.current = null;
    }

    setAuthTransitioning(false);
  };

  const startAuthTransition = () => {
    if (authTransitionTimerRef.current) {
      clearTimeout(authTransitionTimerRef.current);
    }

    setAuthTransitioning(true);

    // Safety release: max 5 seconds only
    authTransitionTimerRef.current = setTimeout(() => {
      setAuthTransitioning(false);
    }, 5000);
  };

  // -------------------------------------------------------
  // TABLET / MOBILE LOGIN RECOVERY
  // -------------------------------------------------------
  //
  // If wallet app/browser temporarily sends the user back
  // to the public landing page, recover the login flow here.
  //
  // WalletModal already stores:
  //   mdefi_user_wallet
  //   walletAddress
  //
  // for registered wallets.
  // -------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    const recoverLoginFlow = async () => {
      const flow = readLoginFlow();

      if (!flow || flow.action !== 'login') {
        return;
      }

      // Only recover the wallet/login stages.
      if (
        flow.stage !== 'wallet' &&
        flow.stage !== 'checking' &&
        flow.stage !== 'connected' &&
        flow.stage !== 'login'
      ) {
        return;
      }

      let storedWallet =
        flow.walletAddress ||
        '';

      try {
        storedWallet =
          storedWallet ||
          localStorage.getItem('mdefi_user_wallet') ||
          localStorage.getItem('walletAddress') ||
          '';
      } catch {
        // Ignore storage errors.
      }

      storedWallet = storedWallet.trim().toLowerCase();

      // If there is no wallet yet, don't force another deep-link.
      // The normal WalletModal remains responsible for connection.
      if (!isValidWalletAddress(storedWallet)) {
        return;
      }

      if (cancelled) return;

      loginFlowLockRef.current = true;

      startAuthTransition();

      setWalletModalAction('login');
      setConnectedWallet(storedWallet);
      setIsWalletConnected(true);

      saveLoginFlow('checking', storedWallet);

      const isReg = await checkRegistrationStatus(storedWallet);

      if (cancelled) return;

      if (isReg) {
        saveLoginFlow('login', storedWallet);

        setShowWalletModal(false);
        setShowRegisterModal(false);

        // This is the existing:
        // "ENTER TO CONNECTED WALLET" login step.
        setShowLoginModal(true);

        stopAuthTransition();
      } else {
        saveLoginFlow('register', storedWallet);

        setShowWalletModal(false);
        setShowLoginModal(false);

        setStatusNotice({
          message:
            'This wallet is not registered yet. Please register first then login.',
          type: 'warning',
        });

        setShowRegisterModal(true);

        stopAuthTransition();
      }

      loginFlowLockRef.current = false;
    };

    recoverLoginFlow();

    return () => {
      cancelled = true;
    };
  }, []);

  // -------------------------------------------------------
  // REFERRAL URL ENTRY SCENARIO
  // -------------------------------------------------------

  useEffect(() => {
    const refCode = extractReferralCodeFromUrl();

    if (!refCode) return;

    setReferralSponsorId(refCode);

    // Do not interfere with an active login recovery.
    const loginFlow = readLoginFlow();

    if (loginFlow?.action === 'login') {
      return;
    }

    if (isWalletConnected && connectedWallet) {
      checkRegistrationStatus(connectedWallet).then((isReg) => {
        if (isReg) {
          setStatusNotice({
            message: 'You are already registered! Please login.',
            type: 'info',
          });

          setShowLoginModal(true);
        } else {
          setShowRegisterModal(true);
        }
      });
    } else {
      setWalletModalAction('register');
      setShowWalletModal(true);
    }
  }, [isWalletConnected, connectedWallet]);

  // -------------------------------------------------------
  // AUTO CLEAR NOTIFICATION
  // -------------------------------------------------------

  useEffect(() => {
    if (!statusNotice) return;

    const timer = setTimeout(() => {
      setStatusNotice(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [statusNotice]);

  // -------------------------------------------------------
  // COMPONENT CLEANUP
  // -------------------------------------------------------

  useEffect(() => {
    return () => {
      if (authTransitionTimerRef.current) {
        clearTimeout(authTransitionTimerRef.current);
      }
    };
  }, []);

  // -------------------------------------------------------
  // SMOOTH SCROLL
  // -------------------------------------------------------

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  // -------------------------------------------------------
  // LEGAL MODAL
  // -------------------------------------------------------

  const handleOpenLegalDoc = (type: LegalDocType) => {
    setCurrentDocType(type);
    setShowLegalDocs(true);
  };

  // -------------------------------------------------------
  // 1. REGISTER TRIGGER
  // -------------------------------------------------------

  const handleTriggerRegister = () => {
    if (isWalletConnected && connectedWallet) {
      startAuthTransition();

      checkRegistrationStatus(connectedWallet).then((isReg) => {
        if (isReg) {
          setStatusNotice({
            message:
              'You are already registered! Redirecting to login...',
            type: 'info',
          });

          setShowRegisterModal(false);
          setShowLoginModal(true);

          stopAuthTransition();
        } else {
          setShowRegisterModal(true);

          stopAuthTransition();
        }
      });

      return;
    }

    setWalletModalAction('register');
    setShowWalletModal(true);
  };

  // -------------------------------------------------------
  // 2. LOGIN TRIGGER
  // -------------------------------------------------------

  const handleTriggerLogin = () => {
    // -----------------------------------------------------
    // IMPORTANT:
    // Every login attempt is persisted before wallet connect.
    // This allows tablet/mobile wallet return recovery.
    // -----------------------------------------------------

    saveLoginFlow('wallet');

    setWalletModalAction('login');

    setShowRegisterModal(false);
    setShowLoginModal(false);

    setStatusNotice(null);

    startAuthTransition();

    if (isWalletConnected && connectedWallet) {
      saveLoginFlow('checking', connectedWallet);

      checkRegistrationStatus(connectedWallet)
        .then((isReg) => {
          if (isReg) {
            saveLoginFlow('login', connectedWallet);

            setShowWalletModal(false);

            // Existing "ENTER TO CONNECTED WALLET" step.
            setShowLoginModal(true);
          } else {
            saveLoginFlow('register', connectedWallet);

            setShowWalletModal(false);

            setStatusNotice({
              message:
                'This wallet is not registered yet. Please register first then login.',
              type: 'warning',
            });

            setShowRegisterModal(true);
          }
        })
        .finally(() => {
          stopAuthTransition();
        });

      return;
    }

    // Normal wallet connection.
    setShowWalletModal(true);

    // Do not release transition here.
    // WalletModal callback will release it after
    // registration status is known.
  };

  // -------------------------------------------------------
  // 3. WALLET CONNECTED CALLBACK
  // -------------------------------------------------------

  const handleWalletConnected = async (
    address: string,
    _walletName: string
  ) => {
    const cleanAddr = (address || '').trim().toLowerCase();

    if (!isValidWalletAddress(cleanAddr)) {
      stopAuthTransition();

      setStatusNotice({
        message: 'Invalid wallet address received. Please reconnect.',
        type: 'warning',
      });

      return;
    }

    // Prevent duplicate callback execution.
    if (loginFlowLockRef.current) {
      return;
    }

    loginFlowLockRef.current = true;

    setConnectedWallet(cleanAddr);
    setIsWalletConnected(true);

    // -----------------------------------------------------
    // VERY IMPORTANT:
    // Keep the landing page hidden while this check runs.
    // -----------------------------------------------------

    startAuthTransition();

    const currentAction = walletModalAction;

    if (currentAction === 'login') {
      saveLoginFlow('checking', cleanAddr);
    }

    try {
      const isReg = await checkRegistrationStatus(cleanAddr);

      // ---------------------------------------------------
      // LOGIN FLOW
      // ---------------------------------------------------

      if (currentAction === 'login') {
        if (!isReg) {
          // Wallet connected but NOT registered.
          saveLoginFlow('register', cleanAddr);

          setShowWalletModal(false);
          setShowLoginModal(false);

          setStatusNotice({
            message:
              'This wallet is not registered yet. Please register first then login.',
            type: 'warning',
          });

          setShowRegisterModal(true);

          stopAuthTransition();

          return;
        }

        // -----------------------------------------------
        // REGISTERED WALLET
        // -----------------------------------------------

        saveLoginFlow('login', cleanAddr);

        setShowWalletModal(false);
        setShowRegisterModal(false);

        // This opens the existing LoginModal where
        // user gets the "ENTER TO CONNECTED WALLET" step.
        setShowLoginModal(true);

        stopAuthTransition();

        return;
      }

      // ---------------------------------------------------
      // REGISTER FLOW
      // ---------------------------------------------------

      if (currentAction === 'register') {
        if (isReg) {
          setShowWalletModal(false);

          setStatusNotice({
            message:
              'You are already registered! Please login to your dashboard.',
            type: 'info',
          });

          setShowLoginModal(true);

          stopAuthTransition();

          return;
        }

        setShowWalletModal(false);
        setShowRegisterModal(true);

        stopAuthTransition();

        return;
      }

      // ---------------------------------------------------
      // GENERAL FLOW
      // ---------------------------------------------------

      setShowWalletModal(false);

      if (isReg) {
        setShowLoginModal(true);
      } else {
        setShowRegisterModal(true);
      }

      stopAuthTransition();
    } catch {
      setShowWalletModal(false);

      setStatusNotice({
        message:
          'Unable to verify wallet registration. Please try again.',
        type: 'warning',
      });

      stopAuthTransition();
    } finally {
      loginFlowLockRef.current = false;
    }
  };

  // -------------------------------------------------------
  // 4. REGISTRATION SUCCESS
  // -------------------------------------------------------

  const handleRegistrationSuccess = (data: {
    userId: string;
    sponsorId: string;
    walletAddress: string;
  }) => {
    setRegisteredUser(data);

    setShowRegisterModal(false);

    setShowCelebration(true);

    clearLoginFlow();

    stopAuthTransition();
  };

  // -------------------------------------------------------
  // 5. CELEBRATION -> APPROVALS
  // -------------------------------------------------------

  const handleProceedToApprovals = () => {
    setShowCelebration(false);
    setShowSystemApprovals(true);
  };

  // -------------------------------------------------------
  // 6. APPROVALS -> COMMUNITY
  // -------------------------------------------------------

  const handleApprovalsComplete = () => {
    setShowSystemApprovals(false);
    setShowCommunityModal(true);
  };

  // -------------------------------------------------------
  // 7. COMMUNITY -> DASHBOARD
  // -------------------------------------------------------

  const handleFinalDashboardEntry = () => {
    setShowCommunityModal(false);

    clearReferralParamFromUrl();
    setReferralSponsorId(null);

    clearLoginFlow();

    stopAuthTransition();

    onEnterDashboard({
      ...registeredUser,
      isNewRegistration: true,
    });
  };

  // -------------------------------------------------------
  // 8. DIRECT LOGIN COMPLETED (Pure Dynamic Handover, No Kickback)
  // -------------------------------------------------------

  const handleDirectLogin = async (
    userIdentifier: string
  ) => {
    clearLoginFlow();
    setShowLoginModal(false);
    setShowRegisterModal(false);

    const targetWallet = (
      connectedWallet ||
      (userIdentifier.startsWith('0x')
        ? userIdentifier
        : '')
    )
      .trim()
      .toLowerCase();

    let resolvedUserFacingId = userIdentifier;
    let resolvedSponsor = '';

    try {
      const dash: any = await contractAdapter.getHubUserData(targetWallet).catch(() => null);
      const numId = Number(dash?.userId?.toString?.() || dash?.numericId || 0);
      if (numId > 0) {
        resolvedUserFacingId = `MDF-${numId}`;
        resolvedSponsor = dash?.sponsor || dash?.sponsorId || '';
      }
    } catch {}

    stopAuthTransition();

    onEnterDashboard({
      userId: resolvedUserFacingId,
      sponsorId: resolvedSponsor,
      walletAddress: targetWallet,
      isNewRegistration: false,
    });
  };

  // -------------------------------------------------------
  // 9. MODULE / POOL / PACKAGE SELECTION
  // -------------------------------------------------------

  const handleSelectModule = (
    moduleId: string,
    moduleKey?: LaunchModuleKey
  ) => {
    if (moduleKey) {
      const status =
        programPhaseService.getModulePhaseStatus(moduleKey);

      if (!status.isUnlocked) {
        setLockedModalData({
          isOpen: true,
          moduleKey,
          requiredPhase:
            status.minPhase as LaunchPhase,
          customTitle:
            MODULE_LAUNCH_DEFINITIONS[moduleKey]?.name,
          customDescription:
            status.lockMessage,
        });

        return;
      }
    }

    if (
      moduleId === 'mbttc-token' ||
      moduleId === 'mbttc-airdrop' ||
      moduleId === 'mbttc-trading'
    ) {
      scrollToSection('mbttc');
    } else {
      handleTriggerRegister();
    }
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#040805] text-white selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">

      {/* ===================================================
          AUTH TRANSITION SHIELD
          Prevents public landing-page flash while login
          wallet status is being resolved.
      =================================================== */}

      {authTransitioning && (
        <div className="fixed inset-0 z-[100] bg-[#040805] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />

              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-teal-300 animate-spin" />

              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              </div>
            </div>

            <div className="text-xs font-mono text-emerald-300 font-bold uppercase tracking-wider">
              Verifying Connected Wallet...
            </div>

            <div className="text-[10px] font-mono text-zinc-500">
              Please wait
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          COSMIC BACKGROUND
      =================================================== */}

      <CosmicBackground />

      {/* ===================================================
          STATUS NOTIFICATION
      =================================================== */}

      {statusNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[90] max-w-md w-11/12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 ${
              statusNotice.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500/50 text-amber-200'
                : statusNotice.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
                : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusNotice.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}

              <span className="text-xs font-mono font-medium">
                {statusNotice.message}
              </span>
            </div>

            <button
              onClick={() => setStatusNotice(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          MAIN PUBLIC LANDING
      =================================================== */}

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* 1. Navigation Header */}
        <LandingHeader
          onLoginClick={handleTriggerLogin}
          onRegisterClick={handleTriggerRegister}
          onNavigateSection={scrollToSection}
        />

        {/* 2. Hero Section */}
        <HeroSection
          onRegisterClick={handleTriggerRegister}
          onLoginClick={handleTriggerLogin}
          onExploreClick={() =>
            scrollToSection('ecosystem')
          }
        />

        {/* 3. MDeFi Ecosystem Overview */}
        <EcosystemSection
          onSelectModule={handleSelectModule}
          onRegisterClick={handleTriggerRegister}
        />

        {/* 5. MBTTC Airdrop */}
        <MbttcAirdropSection
          onClaimClick={handleTriggerRegister}
        />

        {/* 6. MBTTC Token */}
        <MbttcTokenSection />

        {/* 7. Tokenomics */}
        <TokenomicsSection />

        {/* 8. Minting */}
        <MintingPhasesSection />

        {/* 9. Burn */}
        <BurnDeflationSection />

        {/* Why MBTTC */}
        <WhyMbttcSection />

        {/* 10. How It Works */}
        <HowItWorksSection
          onRegisterClick={handleTriggerRegister}
        />

        {/* 11. Exchange Launch */}
        <ExchangeLaunchSection />

        {/* Strategic Roadmap */}
        <RoadmapSection />

        {/* FAQ */}
        <FaqSection />

        {/* Community Activity */}
        <CommunityRecentActivitySection />

        {/* Public Community Rating */}
        <CommunityRatingSection
          variant="public"
          onActionClick={handleTriggerLogin}
        />

        {/* 12. Final Registration CTA */}
        <FinalRegistrationCta
          onRegisterClick={handleTriggerRegister}
          onLoginClick={handleTriggerLogin}
        />

        {/* 13. Footer */}
        <LandingFooter
          onNavigateSection={scrollToSection}
          onOpenLegalDoc={handleOpenLegalDoc}
          onLoginClick={handleTriggerLogin}
          onRegisterClick={handleTriggerRegister}
        />
      </div>

      {/* ===================================================
          1. WEB3 WALLET CONNECT
      =================================================== */}

      <WalletModal
        isOpen={showWalletModal}
        onClose={() => {
          setShowWalletModal(false);

          // Only release transition if user manually closes
          // the wallet modal and no active login callback
          // is being processed.
          if (!loginFlowLockRef.current) {
            const flow = readLoginFlow();

            if (!flow || flow.stage === 'wallet') {
              stopAuthTransition();
            }
          }
        }}
        mode="connect"
        intendedAction={walletModalAction}
        currentAddress={connectedWallet}
        onWalletConnected={handleWalletConnected}
      />

      {/* ===================================================
          2. REGISTER MODAL
      =================================================== */}

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => {
          setShowRegisterModal(false);
          stopAuthTransition();
        }}
        connectedWalletAddress={connectedWallet}
        referralSponsorId={referralSponsorId}
        onSuccess={handleRegistrationSuccess}
        onOpenLegalDoc={handleOpenLegalDoc}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);

          setWalletModalAction('login');

          saveLoginFlow(
            'login',
            connectedWallet
          );

          setShowLoginModal(true);
        }}
        onSwitchWallet={() => {
          setShowRegisterModal(false);

          setWalletModalAction('register');

          setShowWalletModal(true);
        }}
      />

      {/* ===================================================
          3. REGISTRATION CELEBRATION
      =================================================== */}

      {showCelebration && (
        <RegistrationCelebration
          userId={registeredUser.userId}
          sponsorId={registeredUser.sponsorId}
          walletAddress={registeredUser.walletAddress}
          onProceedToApprovals={handleProceedToApprovals}
        />
      )}

      {/* ===================================================
          4. SYSTEM APPROVALS
      =================================================== */}

      {showSystemApprovals && (
        <SystemApprovalsModal
          onApprovalsComplete={handleApprovalsComplete}
        />
      )}

      {/* ===================================================
          5. SOCIAL COMMUNITY
      =================================================== */}

      {showCommunityModal && (
        <SocialCommunityModal
          onEnterDashboard={handleFinalDashboardEntry}
        />
      )}

      {/* ===================================================
          6. DIRECT LOGIN MODAL
          Existing "ENTER TO CONNECTED WALLET" step
      =================================================== */}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);

          // User manually closed login.
          clearLoginFlow();

          stopAuthTransition();
        }}
        connectedWalletAddress={connectedWallet}
        onLoginSuccess={handleDirectLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);

          clearLoginFlow();

          handleTriggerRegister();
        }}
        onSwitchWallet={() => {
          setShowLoginModal(false);

          setWalletModalAction('login');

          saveLoginFlow('wallet');

          setShowWalletModal(true);
        }}
      />

      {/* ===================================================
          7. LEGAL DOCS
      =================================================== */}

      <LegalDocsModal
        isOpen={showLegalDocs}
        docType={currentDocType}
        onClose={() => setShowLegalDocs(false)}
        onSelectDocType={setCurrentDocType}
      />

      {/* ===================================================
          8. PHASE LOCKED VIEW
      =================================================== */}

      {lockedModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl">

            <button
              onClick={() =>
                setLockedModalData((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
              }
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <PhaseLockedView
              moduleKey={lockedModalData.moduleKey}
              requiredPhase={lockedModalData.requiredPhase}
              customTitle={lockedModalData.customTitle}
              customDescription={lockedModalData.customDescription}
              backButtonLabel="CLOSE"
              actionButtonLabel="REGISTER FOR PHASE 1"
              onBackToDashboard={() =>
                setLockedModalData((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
              }
              onNavigateHub={() => {
                setLockedModalData((prev) => ({
                  ...prev,
                  isOpen: false,
                }));

                handleTriggerRegister();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};