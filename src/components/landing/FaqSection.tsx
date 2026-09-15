import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qKey: 'faq_q1',
      qDefault: 'What is MDeFi?',
      aKey: 'faq_a1',
      aDefault: 'MDeFi is a decentralized matrix and reward ecosystem deployed on BNB Smart Chain. It combines transparent smart contract matrix trees (such as S4 Node), community yield pools, and the native Magnet Bitcoin Token (MBTTC) into a single non-custodial Web3 portal.',
    },
    {
      qKey: 'faq_q2',
      qDefault: 'Which node modules are currently active?',
      aKey: 'faq_a2',
      aDefault: 'Currently, the S4 Node (Junior Node $10 and Senior Node $25) is fully active and available. Upcoming modules—including Quantum Node ($70), Nexus Prime ($120), Weekly Reward Starter, Weekly Reward Premium, and Weekly Passive Salary—are actively progressing through development and validator testing.',
    },
    {
      qKey: 'faq_q3',
      qDefault: 'What is MBTTC and what is the maximum mint supply?',
      aKey: 'faq_a3',
      aDefault: 'MBTTC (Magnet Bitcoin Token) is the native BEP-20 utility and gas token of MDeFi. Its total minting program is strictly mathematically capped at 2,000,000 MBTTC, with 70% allocated to registration and referral incentives, 20% to LP bonds, 5% to marketing, and 5% to protocol reserves.',
    },
    {
      qKey: 'faq_q4',
      qDefault: 'How does the 4-Hour MBTTC Airdrop operate?',
      aKey: 'faq_a4',
      aDefault: 'Verified registered community members can claim MBTTC every 4 hours directly from the smart contract relayer. This ensures daily token decentralization and active network participation.',
    },
    {
      qKey: 'faq_q5',
      qDefault: 'Can I register without an upline sponsor ID?',
      aKey: 'faq_a5',
      aDefault: 'Yes. During the registration process, you can indicate whether you have an upline. If you select "No", our smart contract onboarding engine automatically connects your account directly to the configured MDeFi Admin ID (MDF-00109) with zero penalty.',
    },
    {
      qKey: 'faq_q6',
      qDefault: 'When is the exchange launch planned for MBTTC?',
      aKey: 'faq_a6',
      aDefault: 'Exchange launch activities on PancakeSwap, Uniswap, and Bitget are planned following the completion of the 3-phase 2,000,000 MBTTC minting program and subsequent LP bond locking.',
    },
    {
      qKey: 'faq_q7',
      qDefault: 'Is MDeFi non-custodial?',
      aKey: 'faq_a7',
      aDefault: 'Yes, 100%. MDeFi never holds custody of your private keys or personal funds. All matrix node activations, commissions, and reward claims execute directly to and from your connected Web3 wallet via verified smart contracts.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t('faq_badge', 'Community Knowledge Base')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            {t('faq_title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {t('faq_desc', 'Everything you need to know about MDeFi matrix mechanics, MBTTC tokenomics, and registration.')}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/30 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {t(faq.qKey, faq.qDefault)}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-zinc-900 text-zinc-400 shrink-0 ${isOpen ? 'text-emerald-400 bg-emerald-950' : ''}`}>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-900/80 pt-3 animate-in fade-in-50 duration-150">
                    {t(faq.aKey, faq.aDefault)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
