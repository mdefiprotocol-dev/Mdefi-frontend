import React from 'react';
import {
  Layers,
  GitBranch,
  Repeat,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Network
} from 'lucide-react';

export const S4FlowSection: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* =========================================================================
          SECTION 3 & 7: WHAT IS S4 MATRIX? (CONCEPTUAL 2×2 STRUCTURE)
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-teal-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
              The S4 2×2 Matrix Structure
            </h3>
          </div>
          <span className="text-xs font-mono text-teal-400 bg-teal-950/70 px-2.5 py-1 rounded-full border border-teal-500/30">
            6 Total Positions (2 + 4)
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
          The S4 Protocol operates as a decentralized <strong>2×2 matrix infrastructure</strong>. Each matrix cycle consists of exactly two structural levels storing a total of 6 placement positions:
        </p>

        {/* Level 1 & Level 2 summary pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-500/40 text-teal-300 font-mono font-bold flex items-center justify-center text-sm shrink-0">
              L1
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white block">LEVEL 1</span>
              <span className="text-[11px] font-mono text-zinc-400">2 Direct Placements</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-sm shrink-0">
              L2
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-white block">LEVEL 2</span>
              <span className="text-[11px] font-mono text-zinc-400">4 Second-Tier Placements</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold flex items-center justify-center text-sm shrink-0">
              6
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-300 block">TOTAL SLOTS</span>
              <span className="text-[11px] font-mono text-zinc-400">2 + 4 = 6 Full Matrix</span>
            </div>
          </div>
        </div>

        {/* Conceptual Visual Schematic (NOT A RECREATED TREE COMPONENT, CLEAN EXPLANATORY DIAGRAM) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#020d0c] border border-teal-500/30 relative overflow-hidden">
          <div className="text-center mb-6">
            <span className="text-[11px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
              Conceptual 2×2 Placement Geometry
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              *Explanatory schematic. The live matrix utilizes the circular radial visualization engine.
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-5 max-w-md mx-auto">
            {/* Root: YOU */}
            <div className="flex flex-col items-center">
              <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-black font-mono font-black text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-300">
                YOU (ROOT)
              </div>
              <div className="w-0.5 h-6 bg-gradient-to-b from-teal-500 to-teal-400/50" />
            </div>

            {/* Level 1: 2 Positions */}
            <div className="w-full flex items-center justify-around relative">
              {/* Connector horizontal line */}
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-teal-500/30 -z-0" />

              <div className="flex flex-col items-center relative z-10">
                <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-teal-400/60 text-teal-300 font-mono text-xs font-bold shadow-md">
                  #1 • Level 1
                </div>
                <div className="w-0.5 h-6 bg-teal-500/40" />
              </div>

              <div className="flex flex-col items-center relative z-10">
                <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-teal-400/60 text-teal-300 font-mono text-xs font-bold shadow-md">
                  #2 • Level 1
                </div>
                <div className="w-0.5 h-6 bg-teal-500/40" />
              </div>
            </div>

            {/* Level 2: 4 Positions */}
            <div className="w-full grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="px-2.5 py-2 rounded-xl bg-zinc-900/90 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
                #3 • L2
              </div>
              <div className="px-2.5 py-2 rounded-xl bg-zinc-900/90 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
                #4 • L2
              </div>
              <div className="px-2.5 py-2 rounded-xl bg-zinc-900/90 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] font-bold shadow-sm">
                #5 • L2
              </div>
              <div className="px-2.5 py-2 rounded-xl bg-zinc-900/90 border border-purple-500/50 text-purple-300 font-mono text-[11px] font-bold shadow-sm">
                #6 • Recycle
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 text-xs font-mono text-zinc-400 text-center">
            The smart contract stores Level 1 and Level 2 placements separately and considers the matrix full when combined count equals 6.
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: DIRECT SPONSORSHIP VS MATRIX PLACEMENT
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
            Direct Sponsorship vs. Matrix Placement
          </h3>
        </div>

        {/* Highlighted Distinction Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/90 to-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
              Core Protocol Distinction
            </span>
            <div className="text-base sm:text-lg font-mono font-black text-white">
              SPONSOR ≠ NECESSARILY MATRIX PARENT
            </div>
            <p className="text-xs text-zinc-300">
              A sponsor refers a member, but the 2×2 placement algorithm positions them under the next available matrix parent.
            </p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/40 shrink-0">
            Decentralized Placement
          </span>
        </div>

        {/* Side by side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Direct Sponsorship Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                1. Direct Sponsorship
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Referral Link
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              The member activates using your personal referral link. The contract processes the <strong>Direct Referral Income</strong> ($4 on Junior / $8 on Senior) directly for the referrer according to package eligibility rules.
            </p>
            <div className="p-3 rounded-xl bg-zinc-950 text-xs font-mono text-emerald-300 border border-zinc-800/80">
              ✓ Direct Income is paid to the Referrer regardless of matrix tree position.
            </div>
          </div>

          {/* Matrix Placement Card */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                2. Matrix Placement
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Slot Geometry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              The member is positioned into the first open slot in the 2×2 structure. If your Level 1 (2 positions) is filled, they spill over into Level 2 under member #1 or #2, creating a spillover placement.
            </p>
            <div className="p-3 rounded-xl bg-zinc-950 text-xs font-mono text-cyan-300 border border-zinc-800/80">
              ✓ Matrix Income allocation routes to the active matrix parent of that slot.
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 8: HOW MATRIX INCOME WORKS & LEVEL 1 VS LEVEL 2
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
            How Matrix Income Works
          </h3>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          The smart contract processes matrix income strictly according to the actual on-chain placement path rather than simple referral count:
        </p>

        {/* Step-by-step level flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Level 1 Placements */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase">
                Level 1 Placements (Positions #1 &amp; #2)
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                2 Positions
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              When members occupy your Level 1 positions, the contract calculates the package's matrix-income allocation ($4 on Junior, $8 on Senior) and routes it to the applicable upline matrix recipient.
            </p>
            <div className="text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              Level 1 matrix allocation fuels the higher upline tier structure.
            </div>
          </div>

          {/* Level 2 Placements */}
          <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                Level 2 Placements (Positions #3, #4, #5, #6)
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                4 Positions
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Positions #3, #4, and #5 transfer matrix income directly to you (the active matrix parent). The 4th placement (Position #6) triggers the matrix completion and automatic recycle protocol.
            </p>
            <div className="text-[11px] font-mono text-cyan-300 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
              Positions #3, #4, #5 → Matrix Income to YOU. Position #6 → Auto-Recycle.
            </div>
          </div>
        </div>

        {/* Visual Sequential Flow Bar */}
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 text-xs font-mono text-center">
            <div className="px-3 py-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 w-full lg:w-auto">
              LEVEL 1 (2 POSITIONS)
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-zinc-500 lg:hidden" />

            <div className="px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 w-full lg:w-auto">
              LEVEL 2 (4 POSITIONS)
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-zinc-500 lg:hidden" />

            <div className="px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 w-full lg:w-auto">
              6 TOTAL POSITIONS
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-zinc-500 lg:hidden" />

            <div className="px-3 py-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 w-full lg:w-auto">
              MATRIX COMPLETE
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-zinc-500 lg:hidden" />

            <div className="px-3 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 w-full lg:w-auto">
              RECYCLE / RE-ENTRY
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 13 & 14: UPLINE INCOME FLOW & SPILLOVER
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upline Flow */}
        <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Network className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              Upline Income Flow
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono text-zinc-300 leading-relaxed">
            <p>The decentralized upline chain operates across transparent hierarchy levels:</p>

            <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                YOU
              </div>
              <div className="pl-4 text-zinc-500">↓</div>
              <div className="flex items-center gap-2 text-teal-300">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                YOUR SPONSOR / UPLINE
              </div>
              <div className="pl-4 text-zinc-500">↓</div>
              <div className="flex items-center gap-2 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                UPLINE ABOVE
              </div>
              <div className="pl-4 text-zinc-500">↓</div>
              <div className="flex items-center gap-2 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                NETWORK PROTOCOL
              </div>
            </div>

            <p className="text-zinc-400">
              Not every upline receives income from every node. Payment routing strictly depends on the applicable matrix position, sponsor relationship, eligibility, and contract state.
            </p>
          </div>
        </div>

        {/* Spillover & Auto Placement */}
        <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">
              Spillover &amp; Auto Placement
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono text-zinc-300 leading-relaxed">
            <p>
              When a sponsor refers more than 2 partners into their 2×2 matrix, additional referrals spill over into available open positions in Level 2 or below.
            </p>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-cyan-500/20 space-y-2">
              <span className="text-[11px] font-bold text-cyan-300 uppercase block">
                Contract On-Chain Placement Record:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400">
                <div>• <code className="text-zinc-200">sponsor</code> address</div>
                <div>• <code className="text-zinc-200">actualParent</code> address</div>
                <div>• <code className="text-zinc-200">spillType</code> flag</div>
                <div>• <code className="text-zinc-200">slotNumber</code> (1–6)</div>
                <div>• <code className="text-zinc-200">matrixLevel</code> (1 or 2)</div>
                <div>• <code className="text-zinc-200">cycleCount</code> tracker</div>
              </div>
            </div>

            <p className="text-zinc-400">
              The existing contract explicitly distinguishes between Direct Sponsorship and Spill placement types during slot resolution.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 15: WORKING / NON-WORKING ELIGIBILITY
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h3 className="text-base sm:text-lg font-bold text-white font-mono">
            Working vs. Non-Working Placement Dynamics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono leading-relaxed">
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase">
              Working (Active Sponsorship):
            </span>
            <p className="text-zinc-300">
              Active builders share their direct referral link, earning direct referral income for every eligible referred activation ($4 or $8) while rapidly cycling through 2×2 matrix positions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-2">
            <span className="text-cyan-400 font-bold block uppercase">
              Non-Working (Spillover Benefit):
            </span>
            <p className="text-zinc-300">
              Participants whose matrix positions are filled by upline spillover or team dynamics can benefit from matrix completion according to the contract's defined package eligibility criteria.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          *Payment strictly follows the smart-contract eligibility condition. Ineligible payouts are not processed as confirmed income.
        </div>
      </div>

      {/* =========================================================================
          SECTION 17 & 18: AUTOMATIC RECYCLE / RE-ENTRY & MATRIX CYCLE
          ========================================================================= */}
      <div className="rounded-3xl bg-zinc-950/80 border border-zinc-800/90 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Repeat className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg sm:text-xl font-bold text-white font-mono">
              Automatic Recycle &amp; Re-entry Mechanism
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/70 px-2.5 py-1 rounded-full border border-purple-500/30">
            Perpetual Matrix Engine
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          The S4 Protocol avoids dead-ends through an on-chain automatic re-entry algorithm. When all 6 positions in a matrix are filled (2 on Level 1 + 4 on Level 2), the completion process executes automatically:
        </p>

        {/* Circular Matrix Flow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-teal-400 font-bold">STEP 01</span>
            <h4 className="text-sm font-bold text-white">6 Positions Filled</h4>
            <p className="text-zinc-400 text-[11px]">
              Total referrals (<code className="text-zinc-300">firstLevel + secondLevel</code>) reach 6. Matrix status switches to Complete.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-cyan-400 font-bold">STEP 02</span>
            <h4 className="text-sm font-bold text-white">4th Level-2 Slot Closes</h4>
            <p className="text-zinc-400 text-[11px]">
              The 4th Level-2 slot (Position #6) allocation funds the automated re-entry rather than a static payout.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-purple-400 font-bold">STEP 03</span>
            <h4 className="text-sm font-bold text-white">Recycle Counter +1</h4>
            <p className="text-zinc-400 text-[11px]">
              The contract increments <code className="text-zinc-300">recycleCount</code> and archives the completed cycle history.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-amber-400 font-bold">STEP 04</span>
            <h4 className="text-sm font-bold text-white">Referral Slots Reset</h4>
            <p className="text-zinc-400 text-[11px]">
              Level 1 and Level 2 position arrays are initialized to 0/6, opening fresh available slots.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-emerald-400 font-bold">STEP 05</span>
            <h4 className="text-sm font-bold text-white">New Parent Search</h4>
            <p className="text-zinc-400 text-[11px]">
              The algorithm searches for the next open slot under your active upline or sponsor's active matrix.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-xs">
            <span className="text-teal-400 font-bold">STEP 06</span>
            <h4 className="text-sm font-bold text-white">Fresh Cycle Begins</h4>
            <p className="text-zinc-400 text-[11px]">
              You re-enter as a new node in the ecosystem, ready to receive new direct referrals and spillover.
            </p>
          </div>
        </div>

        {/* =========================================================================
            SECTION 19: S4 CYCLE MODEL — 300% RETURN STRUCTURE
            ========================================================================= */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#071d18] via-[#051515] to-[#0a1524] border border-teal-500/30 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm sm:text-base font-bold text-white font-mono">
                S4 Cycle Model — 300% Return Structure
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
              Illustrative Matrix Metric
            </span>
          </div>

          <p className="text-xs font-mono text-zinc-300 leading-relaxed">
            In the standard mathematical model of an S4 2×2 cycle, three of the four Level-2 positions (#3, #4, #5) pay matrix income to the matrix owner. Because each slot yields 100% of the matrix allocation, completing the three positions represents a <strong>300% matrix allocation output</strong> relative to that single node's matrix allocation fee.
          </p>

          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-400">
            <strong>Protocol Notice:</strong> Illustrative model. Actual outcomes depend on contract conditions, active sponsorship, matrix placement, eligibility, and on-chain activity. This does NOT constitute guaranteed profit or risk-free return.
          </div>
        </div>
      </div>
    </div>
  );
};
