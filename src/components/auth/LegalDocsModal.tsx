import React from 'react';
import { X, ShieldAlert, FileText, CheckCircle2, Lock } from 'lucide-react';

export type LegalDocType = 'risk' | 'privacy' | 'disclaimer';

interface LegalDocsModalProps {
  isOpen: boolean;
  docType: LegalDocType;
  onClose: () => void;
  onSelectDocType: (type: LegalDocType) => void;
}

export const LegalDocsModal: React.FC<LegalDocsModalProps> = ({
  isOpen,
  docType,
  onClose,
  onSelectDocType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50 duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl bg-[#080d09] border border-emerald-500/40 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Legal &amp; Protocol Documentation
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                MDeFi Compliance Standard
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4 flex gap-2 border-b border-zinc-900 bg-zinc-950/40">
          <button
            onClick={() => onSelectDocType('risk')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              docType === 'risk'
                ? 'bg-[#080d09] text-emerald-400 border-t-2 border-x border-emerald-500/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Risk Management
          </button>
          <button
            onClick={() => onSelectDocType('privacy')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              docType === 'privacy'
                ? 'bg-[#080d09] text-emerald-400 border-t-2 border-x border-emerald-500/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onSelectDocType('disclaimer')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              docType === 'disclaimer'
                ? 'bg-[#080d09] text-emerald-400 border-t-2 border-x border-emerald-500/50'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Disclaimer
          </button>
        </div>

        {/* Document Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-h-[55vh]">
          {docType === 'risk' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Risk Management Policy</h4>
              <p>
                Participation in decentralized matrix ecosystems, cryptographic smart contracts, and peer-to-peer digital assets involves inherent technological and financial risks. Users should carefully review the following considerations:
              </p>
              <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-emerald-400 block">1. Smart Contract Execution Risk:</span>
                <p className="text-xs text-zinc-400">
                  All transactions and matrix placements are handled autonomously by immutable smart contracts deployed on the BNB Smart Chain network. Once transactions are confirmed on-chain, they are mathematically irreversible.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-emerald-400 block">2. Non-Custodial Responsibility:</span>
                <p className="text-xs text-zinc-400">
                  MDeFi does not hold custody of your private cryptographic keys, seed phrases, or wallet credentials. Loss of wallet access results in irreversible loss of associated permissions and balances.
                </p>
              </div>
              <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-emerald-400 block">3. Matrix Participation Dynamics:</span>
                <p className="text-xs text-zinc-400">
                  Matrix rewards and spillover dynamics depend on network growth, active participation, and binary structural completions. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          )}

          {docType === 'privacy' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Privacy Policy</h4>
              <p>
                MDeFi is committed to privacy by design through decentralized web3 architecture:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-zinc-400">
                <li><strong className="text-white">Zero Personal Data Collection:</strong> We do not collect, harvest, or sell personal identifiable information (PII), real names, physical addresses, or phone numbers.</li>
                <li><strong className="text-white">Public Blockchain Transparency:</strong> All interactions with smart contracts are recorded publicly on the BNB Smart Chain ledger, accessible via standard blockchain explorers (BscScan).</li>
                <li><strong className="text-white">Local Storage Preferences:</strong> Client-side preferences such as audio effects or animation toggles are stored strictly in your browser's local sandbox.</li>
              </ul>
            </div>
          )}

          {docType === 'disclaimer' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white">Protocol Disclaimer</h4>
              <p>
                The information provided across the MDeFi website, interface, and documentation does not constitute financial, legal, investment, or tax advice.
              </p>
              <p className="text-zinc-400">
                MBTTC and MDeFi matrix nodes are utility-driven cryptographic mechanisms for decentralized interaction. No guarantees of profit, fixed returns, or investment dividends are implied or promised. Participants interact voluntarily at their own discretion in compliance with local applicable laws and jurisdictions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-zinc-800/80 bg-zinc-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            I UNDERSTAND &amp; CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
