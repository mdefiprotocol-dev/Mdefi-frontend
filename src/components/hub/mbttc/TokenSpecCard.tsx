import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Coins, 
  Cpu, 
  Flame, 
  Lock,
  Layers,
  Database
} from 'lucide-react';
import { 
  MBTTC_TOKEN_ADDRESS, 
  MDEFI_HUB_ADDRESS, 
  BURN_DEAD_ADDRESS, 
  ECOSYSTEM_TELEMETRY 
} from '../../../data/contractConfig';
import { MBTTC_TOKEN_INFO } from '../../../data/mbttcTokenInfo';

export const TokenSpecCard: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2000);
  };

  const specifications = [
    { label: 'Token Name', value: MBTTC_TOKEN_INFO.name, highlight: false },
    { label: 'Token Symbol', value: MBTTC_TOKEN_INFO.symbol, highlight: true },
    { label: 'Token Standard', value: MBTTC_TOKEN_INFO.standard, highlight: false },
    { label: 'Network / Chain', value: MBTTC_TOKEN_INFO.blockchain, highlight: false },
    { label: 'Token Decimals', value: '18', highlight: false },
    { label: 'Hard Supply Cap', value: ECOSYSTEM_TELEMETRY.hardCap, highlight: true },
    { label: 'Benchmark Rate', value: `$${MBTTC_TOKEN_INFO.benchmarkRateUsd.toFixed(2)} USD`, highlight: true },
    { label: 'Protocol Phase', value: `${MBTTC_TOKEN_INFO.currentPhase} (${MBTTC_TOKEN_INFO.phaseStatus})`, highlight: false },
  ];

  const contracts = [
    {
      key: 'token',
      title: 'MBTTC Token Smart Contract',
      subtitle: 'BEP-20 Verified Token Contract',
      address: MBTTC_TOKEN_ADDRESS,
      icon: Coins,
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    },
    {
      key: 'hub',
      title: 'MDeFi Protocol Core Vault Hub',
      subtitle: 'Decentralized Vault Controller',
      address: MDEFI_HUB_ADDRESS,
      icon: Cpu,
      accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    },
    {
      key: 'burn',
      title: 'Deflationary Burn Address (Null)',
      subtitle: 'Irreversible Proof-of-Burn Sink',
      address: BURN_DEAD_ADDRESS,
      icon: Flame,
      accent: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Specifications Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-zinc-900/40 border border-emerald-500/20 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Technical Specifications
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>MBTTC Architecture &amp; Protocol Parameters</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
            BEP-20 Immutable Standard
          </span>
        </div>

        {/* 8 Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {specifications.map((spec, i) => (
            <div
              key={i}
              className="p-3.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                {spec.label}
              </span>
              <span
                className={`text-sm sm:text-base font-mono font-bold block truncate ${
                  spec.highlight ? 'text-emerald-400' : 'text-white'
                }`}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* Smart Contracts & Security Section */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
            Verified Smart Contract Ecosystem
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contracts.map((c) => {
              const Icon = c.icon;
              const isCopied = copiedKey === c.key;

              return (
                <div
                  key={c.key}
                  className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl border ${c.accent}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                        c.address ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-amber-950/60 border-amber-500/30 text-amber-400 font-bold'
                      }`}>
                        {c.address ? 'Verified' : 'Pre-Deployment'}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white font-mono">{c.title}</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{c.subtitle}</p>
                  </div>

                  <div className="pt-2 border-t border-zinc-900 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-zinc-300 truncate max-w-[180px] sm:max-w-[190px]">
                      {c.address && c.address.length >= 18
                        ? `${c.address.slice(0, 10)}...${c.address.slice(-8)}`
                        : 'Pre-Deployment (Pending Contract Launch)'}
                    </span>
                    {c.address ? (
                      <button
                        type="button"
                        onClick={() => handleCopy(c.key, c.address)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors shrink-0 flex items-center gap-1 text-[10px] font-mono cursor-pointer"
                        title="Copy Address"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-500 px-2 py-1 rounded bg-zinc-900 border border-zinc-850">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security & Immutable Rules Note */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-emerald-500/20 flex items-start gap-3 text-xs text-zinc-300">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white font-mono text-xs block">
              Immutable Smart Contract Hard Ceiling
            </span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Upon reaching the 2,000,000 MBTTC ceiling, protocol minting functions permanently self-terminate on-chain. Token parameters, supply allocation caps, and contract addresses are strictly unchangeable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
