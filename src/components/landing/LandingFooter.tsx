import React from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Send, 
  MessageCircle, 
  Twitter, 
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { MbttcCoin3D } from '../MbttcCoin3D';
import { useLanguage } from '../../context/LanguageContext';

interface LandingFooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenLegalDoc: (docType: 'risk' | 'privacy' | 'disclaimer') => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateSection,
  onOpenLegalDoc,
  onLoginClick,
  onRegisterClick,
}) => {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-[#030704] border-t border-emerald-500/20 pt-16 pb-12 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <MbttcCoin3D size="sm" interactive={false} autoRotate={true} />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  MDeFi Protocol
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Magnet Bitcoin Token Ecosystem
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              {t('landing_footer_desc', 'MDeFi is a premier decentralized matrix smart contract ecosystem powered by the BEP-20 Magnet Bitcoin Token (MBTTC). Engineered for algorithmic transparency and non-custodial asset custody.')}
            </p>

            {/* Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-300 flex items-center justify-center transition-colors"
                title="Telegram Official Channel"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-cyan-300 flex items-center justify-center transition-colors"
                title="X (Twitter) Official"
              >
                <Twitter className="w-4 h-4" />
              </a>

              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/40 text-zinc-300 hover:text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp Global Community"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {t('landing_footer_nav', 'Navigation')}
            </span>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={() => onNavigateSection('hero')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_home', 'Home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('ecosystem')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_ecosystem', 'Ecosystem Modules')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('how-it-works')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_how_it_works', 'How It Works')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('mbttc')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_tokenomics', 'MBTTC Tokenomics')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('roadmap')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_roadmap', 'Exchange Roadmap')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('faq')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_faq', 'FAQ')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('community-activity')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_activity', 'Ecosystem Activities')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('community-rating')} className="hover:text-emerald-300 transition-colors">
                  {t('nav_rating', 'Community Rating')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Access */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {t('landing_footer_account', 'Account Access')}
            </span>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button onClick={onRegisterClick} className="text-emerald-400 font-semibold hover:underline">
                  {t('landing_footer_create', 'Create Account (Register)')}
                </button>
              </li>
              <li>
                <button onClick={onLoginClick} className="hover:text-white transition-colors">
                  {t('landing_footer_login', 'Login to Dashboard')}
                </button>
              </li>
              <li>
                <span className="text-zinc-600">Admin Sponsor: MDF-00109</span>
              </li>
              <li>
                <span className="text-zinc-600">Chain ID: 56 (BSC Mainnet)</span>
              </li>
            </ul>
          </div>

          {/* Col 5: Governance & Compliance */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              {t('landing_footer_legal', 'Legal & Policy')}
            </span>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <button 
                  onClick={() => onOpenLegalDoc('risk')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-left"
                >
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>{t('landing_footer_risk', 'Risk Management')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalDoc('privacy')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-left"
                >
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>{t('landing_footer_privacy', 'Privacy Policy')}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegalDoc('disclaimer')}
                  className="hover:text-emerald-300 transition-colors flex items-center gap-1 text-left"
                >
                  <FileText className="w-3 h-3 text-zinc-500" />
                  <span>{t('landing_footer_disclaimer', 'Protocol Disclaimer')}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>© {new Date().getFullYear()} {t('landing_footer_copyright', 'MDeFi Protocol. All smart contracts immutable.')}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>BNB Smart Chain (BEP-20)</span>
            <span>{t('landing_footer_non_custodial', 'Non-Custodial Architecture')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
