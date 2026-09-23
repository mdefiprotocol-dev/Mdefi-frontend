import React, { useState, useEffect } from 'react';
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
import { LaunchPhase, LaunchModuleKey, MODULE_LAUNCH_DEFINITIONS } from '../../config/launchPhaseConfig';
import { extractReferralCodeFromUrl, clearReferralParamFromUrl } from '../../utils/referralUtils';
import { contractAdapter } from '../../services/contractAdapter';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (user?: { userId: string; sponsorId: string; walletAddress: string; isNewRegistration?: boolean }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  // Web3 Wallet Connect Modal State
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletModalAction, setWalletModalAction] = useState<'register' | 'login' | 'general'>('register');
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // Status Notification Banners for Registration/Login status
  const [statusNotice, setStatusNotice] = useState<{ message: string; type: 'info' | 'warning' | 'success' } | null>(null);

  // Referral Entry Context (Session Scoped)
  const [referralSponsorId, setReferralSponsorId] = useState<string | null>(() => {
    return extractReferralCodeFromUrl();
  });

  // Authentication Flow Modals
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSystemApprovals, setShowSystemApprovals] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  
  // Phase Lock Modal State
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

  // Legal Docs Modal State
  const [showLegalDocs, setShowLegalDocs] = useState(false);
  const [currentDocType, setCurrentDocType] = useState<LegalDocType>('risk');

  // Real Registered User Context (Zero Mock Data)
  const [registeredUser, setRegisteredUser] = useState<{
    userId: string;
    sponsorId: string;
    walletAddress: string;
  }>({
    userId: '',
    sponsorId: '',
    walletAddress: '',
  });

  // Check on-chain registration helper
  const checkRegistrationStatus = async (address: string): Promise<boolean> => {
    try {
      const node = await contractAdapter.getHubUserNode(address);
      if (!node) return false;
      const numId = Number(node.id || 0);
      return Boolean(node.isRegistered || numId > 0);
    } catch {
      return false;
    }
  };

  // Referral URL Entry Scenario: If arriving via referral link (?ref=MDF-XXXXX), start flow with wallet connection
  useEffect(() => {
    const refCode = extractReferralCodeFromUrl();
    if (refCode) {
      setReferralSponsorId(refCode);
      if (isWalletConnected && connectedWallet) {
        checkRegistrationStatus(connectedWallet).then((isReg) => {
          if (isReg) {
            setStatusNotice({ message: 'You are already registered! Please login.', type: 'info' });
            setShowLoginModal(true);
          } else {
            setShowRegisterModal(true);
          }
        });
      } else {
        setWalletModalAction('register');
        setShowWalletModal(true);
      }
    }
  }, [isWalletConnected, connectedWallet]);

  // Auto-clear notification banners after 5 seconds
  useEffect(() => {
    if (statusNotice) {
      const timer = setTimeout(() => setStatusNotice(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusNotice]);

  // Smooth scroll helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Legal Modal with specific doc
  const handleOpenLegalDoc = (type: LegalDocType) => {
    setCurrentDocType(type);
    setShowLegalDocs(true);
  };

  // 1. REGISTER TRIGGER: Must open Web3 Wallet Connect first
  const handleTriggerRegister = () => {
    if (isWalletConnected && connectedWallet) {
      checkRegistrationStatus(connectedWallet).then((isReg) => {
        if (isReg) {
          setStatusNotice({ message: 'You are already registered! Redirecting to login...', type: 'info' });
          setShowLoginModal(true);
        } else {
          setShowRegisterModal(true);
        }
      });
    } else {
      setWalletModalAction('register');
      setShowWalletModal(true);
    }
  };

  // 2. LOGIN TRIGGER: Must open Web3 Wallet Connect first
  const handleTriggerLogin = () => {
    if (isWalletConnected && connectedWallet) {
      checkRegistrationStatus(connectedWallet).then((isReg) => {
        if (!isReg) {
          setStatusNotice({ message: 'Please register first then login.', type: 'warning' });
          setShowRegisterModal(true);
        } else {
          setShowLoginModal(true);
        }
      });
    } else {
      setWalletModalAction('login');
      setShowWalletModal(true);
    }
  };

  // 3. WALLET CONNECTED CALLBACK: Transition with instant On-Chain Verification
  const handleWalletConnected = async (address: string, _walletName: string) => {
    setConnectedWallet(address);
    setIsWalletConnected(true);
    setShowWalletModal(false);

    const isReg = await checkRegistrationStatus(address);

    if (walletModalAction === 'register') {
      if (isReg) {
        setStatusNotice({ message: 'You are already registered! Please login to your dashboard.', type: 'info' });
        setShowLoginModal(true);
      } else {
        setShowRegisterModal(true);
      }
    } else if (walletModalAction === 'login') {
      if (!isReg) {
        setStatusNotice({ message: 'This wallet is not registered yet. Please register first then login.', type: 'warning' });
        setShowRegisterModal(true);
      } else {
        setShowLoginModal(true);
      }
    } else {
      if (isReg) {
        setShowLoginModal(true);
      } else {
        setShowRegisterModal(true);
      }
    }
  };

  // 4. REGISTRATION FORM COMPLETED: Proceed to Celebration Modal
  const handleRegistrationSuccess = (data: { userId: string; sponsorId: string; walletAddress: string }) => {
    setRegisteredUser(data);
    setShowRegisterModal(false);
    setShowCelebration(true);
  };

  // 5. CELEBRATION COMPLETED: Proceed to System Approvals Modal
  const handleProceedToApprovals = () => {
    setShowCelebration(false);
    setShowSystemApprovals(true);
  };

  // 6. APPROVALS COMPLETED: Proceed to Social Community Modal
  const handleApprovalsComplete = () => {
    setShowSystemApprovals(false);
    setShowCommunityModal(true);
  };

  // 7. COMMUNITY MODAL COMPLETED: Enter Existing Main Dashboard
  const handleFinalDashboardEntry = () => {
    setShowCommunityModal(false);
    clearReferralParamFromUrl();
    setReferralSponsorId(null);
    onEnterDashboard({ ...registeredUser, isNewRegistration: true });
  };

  // 8. DIRECT LOGIN COMPLETED: Enter Existing Main Dashboard
  const handleDirectLogin = (userIdentifier: string) => {
    setShowLoginModal(false);
    onEnterDashboard({
      userId: userIdentifier,
      sponsorId: '',
      walletAddress: connectedWallet || (userIdentifier.startsWith('0x') ? userIdentifier : ''),
    });
  };

  // 9. MODULE / POOL / PACKAGE SELECTION HANDLERS WITH LAUNCH PHASE GATING
  const handleSelectModule = (moduleId: string, moduleKey?: LaunchModuleKey) => {
    if (moduleKey) {
      const status = programPhaseService.getModulePhaseStatus(moduleKey);
      if (!status.isUnlocked) {
        setLockedModalData({
          isOpen: true,
          moduleKey,
          requiredPhase: status.minPhase as LaunchPhase,
          customTitle: MODULE_LAUNCH_DEFINITIONS[moduleKey]?.name,
          customDescription: status.lockMessage,
        });
        return;
      }
    }

    if (moduleId === 'mbttc-token' || moduleId === 'mbttc-airdrop' || moduleId === 'mbttc-trading') {
      scrollToSection('mbttc');
    } else {
      handleTriggerRegister();
    }
  };

  return (
    <div className="min-h-screen bg-[#040805] text-white selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Floating Status Notification Banner */}
      {statusNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 ${
            statusNotice.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2.5">
              {statusNotice.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span className="text-xs font-mono font-medium">{statusNotice.message}</span>
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

      {/* Main Content Layer */}
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
          onExploreClick={() => scrollToSection('ecosystem')}
        />

        {/* 3. MDeFi Ecosystem Overview */}
        <EcosystemSection
          onSelectModule={handleSelectModule}
          onRegisterClick={handleTriggerRegister}
        />

        {/* 5. MBTTC Airdrop Section */}
        <MbttcAirdropSection
          onClaimClick={handleTriggerRegister}
        />

        {/* 6. MBTTC Token Utility */}
        <MbttcTokenSection />

        {/* 7. MBTTC Tokenomics */}
        <TokenomicsSection />

        {/* 8. MBTTC Minting Phases */}
        <MintingPhasesSection />

        {/* 9. Burn / Deflationary Utility */}
        <BurnDeflationSection />

        {/* Why MBTTC? */}
        <WhyMbttcSection />

        {/* 10. How It Works */}
        <HowItWorksSection
          onRegisterClick={handleTriggerRegister}
        />

        {/* 11. Exchange Launch Roadmap */}
        <ExchangeLaunchSection />

        {/* Strategic Roadmap */}
        <RoadmapSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* MDeFi Ecosystem Activities */}
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

        {/* 13. Ecosystem Footer */}
        <LandingFooter
          onNavigateSection={scrollToSection}
          onOpenLegalDoc={handleOpenLegalDoc}
          onLoginClick={handleTriggerLogin}
          onRegisterClick={handleTriggerRegister}
        />
      </div>

      {/* --- Modals & Flows --- */}

      {/* 1. Step 1: Web3 Wallet Connect Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        mode="connect"
        intendedAction={walletModalAction}
        currentAddress={connectedWallet}
        onWalletConnected={handleWalletConnected}
      />

      {/* 2. Step 2: Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        connectedWalletAddress={connectedWallet}
        referralSponsorId={referralSponsorId}
        onSuccess={handleRegistrationSuccess}
        onOpenLegalDoc={handleOpenLegalDoc}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
        onSwitchWallet={() => {
          setShowRegisterModal(false);
          setWalletModalAction('register');
          setShowWalletModal(true);
        }}
      />

      {/* 3. Step 3: Registration Celebration Full-Screen Reward Modal */}
      {showCelebration && (
        <RegistrationCelebration
          userId={registeredUser.userId}
          sponsorId={registeredUser.sponsorId}
          walletAddress={registeredUser.walletAddress}
          onProceedToApprovals={handleProceedToApprovals}
        />
      )}

      {/* 4. Step 4: System Approvals Modal */}
      {showSystemApprovals && (
        <SystemApprovalsModal
          onApprovalsComplete={handleApprovalsComplete}
        />
      )}

      {/* 5. Step 5: Social Community Modal */}
      {showCommunityModal && (
        <SocialCommunityModal
          onEnterDashboard={handleFinalDashboardEntry}
        />
      )}

      {/* 6. Step 2 (Alt): Direct Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        connectedWalletAddress={connectedWallet}
        onLoginSuccess={handleDirectLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          handleTriggerRegister();
        }}
        onSwitchWallet={() => {
          setShowLoginModal(false);
          setWalletModalAction('login');
          setShowWalletModal(true);
        }}
      />

      {/* 7. Legal & Policy Documentation Viewer */}
      <LegalDocsModal
        isOpen={showLegalDocs}
        docType={currentDocType}
        onClose={() => setShowLegalDocs(false)}
        onSelectDocType={setCurrentDocType}
      />

      {/* 8. Phase Locked Modal Notice */}
      {lockedModalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl">
            <button
              onClick={() => setLockedModalData(prev => ({ ...prev, isOpen: false }))}
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
              onBackToDashboard={() => setLockedModalData(prev => ({ ...prev, isOpen: false }))}
              onNavigateHub={() => {
                setLockedModalData(prev => ({ ...prev, isOpen: false }));
                handleTriggerRegister();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};