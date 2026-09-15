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
import { X } from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: (user?: { userId: string; sponsorId: string; walletAddress: string; isNewRegistration?: boolean }) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  // Web3 Wallet Connect Modal State
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletModalAction, setWalletModalAction] = useState<'register' | 'login' | 'general'>('register');
  const [connectedWallet, setConnectedWallet] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

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

  // Registered User Context
  const [registeredUser, setRegisteredUser] = useState<{
    userId: string;
    sponsorId: string;
    walletAddress: string;
  }>({
    userId: 'MDF-08421',
    sponsorId: 'MDF-00109',
    walletAddress: '0x71C839Fa24e93C298B321f8a84620a3b221B389',
  });

  // Referral URL Entry Scenario: If arriving via referral link (?ref=MDF-08421), start existing flow with wallet connection
  useEffect(() => {
    const refCode = extractReferralCodeFromUrl();
    if (refCode) {
      setReferralSponsorId(refCode);
      if (isWalletConnected && connectedWallet) {
        setShowRegisterModal(true);
      } else {
        setWalletModalAction('register');
        setShowWalletModal(true);
      }
    }
  }, []);

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
      setShowRegisterModal(true);
    } else {
      setWalletModalAction('register');
      setShowWalletModal(true);
    }
  };

  // 2. LOGIN TRIGGER: Must open Web3 Wallet Connect first
  const handleTriggerLogin = () => {
    if (isWalletConnected && connectedWallet) {
      setShowLoginModal(true);
    } else {
      setWalletModalAction('login');
      setShowWalletModal(true);
    }
  };

  // 3. WALLET CONNECTED CALLBACK: Transition to respective flow
  const handleWalletConnected = (address: string, _walletName: string) => {
    setConnectedWallet(address);
    setIsWalletConnected(true);
    setShowWalletModal(false);

    if (walletModalAction === 'register') {
      setShowRegisterModal(true);
    } else if (walletModalAction === 'login') {
      setShowLoginModal(true);
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
      userId: userIdentifier.startsWith('0x') ? 'MDF-08421' : userIdentifier,
      sponsorId: 'MDF-00109',
      walletAddress: connectedWallet || (userIdentifier.startsWith('0x') ? userIdentifier : '0x71C839Fa24e93C298B321f8a84620a3b221B389'),
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

        {/* 5. MBTTC Airdrop Section (4-hour countdown) */}
        <MbttcAirdropSection
          onClaimClick={handleTriggerRegister}
        />

        {/* 6. MBTTC Token Utility */}
        <MbttcTokenSection />

        {/* 7. MBTTC Tokenomics (2,000,000 Mint Cap) */}
        <TokenomicsSection />

        {/* 8. MBTTC Minting Phases (Phase 1, Phase 2, Phase 3) */}
        <MintingPhasesSection />

        {/* 9. Burn / Deflationary Utility */}
        <BurnDeflationSection />

        {/* Why MBTTC? (5 Value Pillars) */}
        <WhyMbttcSection />

        {/* 10. How It Works */}
        <HowItWorksSection
          onRegisterClick={handleTriggerRegister}
        />

        {/* 11. Exchange Launch Roadmap (PancakeSwap, Uniswap, Bitget) */}
        <ExchangeLaunchSection />

        {/* Strategic Roadmap */}
        <RoadmapSection />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* MDeFi Ecosystem Activities (Global Ecosystem Pulse) */}
        <CommunityRecentActivitySection />

        {/* Public Community Rating (Reflecting Dashboard Submissions) */}
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

      {/* 2. Step 2: Register Modal (Only after wallet connection) */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        connectedWalletAddress={connectedWallet || '0x71C839Fa24e93C298B321f8a84620a3b221B389'}
        referralSponsorId={referralSponsorId}
        onSuccess={handleRegistrationSuccess}
        onOpenLegalDoc={handleOpenLegalDoc}
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

      {/* 6. Step 2 (Alt): Direct Login Modal (Triggered after wallet connect) */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        connectedWalletAddress={connectedWallet || '0x71C839Fa24e93C298B321f8a84620a3b221B389'}
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
