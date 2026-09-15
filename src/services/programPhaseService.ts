/**
 * MDeFi Program Phase & Module Lifecycle Service
 * 
 * Master Ecosystem Phased Launch Architecture:
 * 
 * PHASE 1:
 * - HUB 🟢 LIVE
 * - REGISTRATION 🟢 LIVE
 * - CLAIM / MINTING 🟢 LIVE
 * - MBTTC TOKEN TRADING 🔒 PHASE 4
 * - S4 MATRIX 🔒 PHASE 2
 * - STARTER REWARD 🔒 PHASE 2
 * - QUANTUM NODE 🔒 PHASE 3
 * - NEXUS PRIME 🔒 PHASE 3
 * - PREMIUM REWARD 🔒 PHASE 3
 * - WEEKLY PASSIVE SALARY 🔒 PHASE 3
 * 
 * PHASE 2:
 * - HUB 🟢 LIVE
 * - REGISTRATION 🟢 LIVE
 * - CLAIM / MINTING 🟢 LIVE
 * - S4 MATRIX 🟢 LIVE
 * - STARTER REWARD 🟢 LIVE
 * - MBTTC LIVE RATE 🟢 LIVE (Treasury IPO ecosystem connection)
 * - MBTTC TRADING 🔒 PHASE 4
 * - QUANTUM NODE 🔒 PHASE 3
 * - NEXUS PRIME 🔒 PHASE 3
 * - PREMIUM REWARD 🔒 PHASE 3
 * - WEEKLY PASSIVE SALARY 🔒 PHASE 3
 * 
 * PHASE 3:
 * - All Phase 2 LIVE modules
 * - QUANTUM NODE 🟢 LIVE
 * - NEXUS PRIME 🟢 LIVE
 * - PREMIUM REWARD 🟢 LIVE
 * - WEEKLY PASSIVE SALARY 🟢 LIVE
 * - MBTTC TRADING 🔒 PHASE 4
 * 
 * PHASE 4:
 * - All previously launched modules remain LIVE
 * - MBTTC TOKEN TRADING 🟢 LIVE
 */

import {
  LaunchPhase,
  ACTIVE_LAUNCH_PHASE,
  MODULE_LAUNCH_DEFINITIONS,
  LaunchModuleKey,
  getModulePhaseBadge,
  getModuleLockMessage,
  isPhaseActive,
} from '../config/launchPhaseConfig';
import { isContractDeployed, isContractActive } from '../config/contractConfig';

export type SystemMode = 'demo' | 'production';
export type { LaunchPhase };

export type ModuleOperationalState =
  | 'DEMO'
  | 'PHASE_LOCKED'
  | 'COMING_SOON'
  | 'LIVE'
  | 'ACTIVATION_REQUIRED'
  | 'LOCKED';

class ProgramPhaseService {
  // Master Launch Phase: Initialized directly from central launchPhaseConfig
  private activePhase: LaunchPhase = ACTIVE_LAUNCH_PHASE;
  // System mode: demo or production
  private systemMode: SystemMode = 'demo';
  // Demo mode tree inspection override (for developer/testing evaluation)
  private demoTreeOverride: boolean = false;

  constructor() {
    // If hub contract is deployed, system can operate in production mode
    if (isContractDeployed('mdefiHub')) {
      this.systemMode = 'production';
    } else {
      this.systemMode = 'demo';
    }
  }

  public getSystemMode(): SystemMode {
    return this.systemMode;
  }

  public isDemoMode(): boolean {
    return this.systemMode === 'demo';
  }

  public setSystemMode(mode: SystemMode): void {
    this.systemMode = mode;
  }

  public getCurrentPhase(): LaunchPhase {
    return this.activePhase;
  }

  /**
   * Set current phase dynamically (supports testing Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 transitions)
   */
  public setCurrentPhase(phase: LaunchPhase): void {
    this.activePhase = phase;
  }

  /**
   * Check if a specific module is unlocked in the current launch phase
   */
  public isModuleUnlocked(moduleKey: LaunchModuleKey): boolean {
    return isPhaseActive(MODULE_LAUNCH_DEFINITIONS[moduleKey].minPhase, this.activePhase);
  }

  /**
   * Get minimum required phase for a module
   */
  public getRequiredPhase(moduleKey: LaunchModuleKey): LaunchPhase {
    return MODULE_LAUNCH_DEFINITIONS[moduleKey]?.minPhase ?? 1;
  }

  /**
   * Get status badge text for navigation / card pills
   */
  public getBadge(moduleKey: LaunchModuleKey): string {
    return getModulePhaseBadge(moduleKey, this.activePhase);
  }

  /**
   * Determine the operational state of a module.
   */
  public getModuleStatus(moduleKey: LaunchModuleKey, isUserPackageActive: boolean = true): ModuleOperationalState {
    const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
    if (!def) return 'LOCKED';

    // 1. Central Phased Launch Gate
    if (!this.isModuleUnlocked(moduleKey)) {
      return 'PHASE_LOCKED';
    }

    // 2. Package activation requirement
    if (!isUserPackageActive) {
      return 'ACTIVATION_REQUIRED';
    }

    // 3. Demo vs Production
    if (this.isDemoMode()) {
      return 'DEMO';
    }

    return 'LIVE';
  }

  /**
   * Route Guard Checker:
   * Maps a route name to access eligibility.
   * Direct URL protection: Ensures user cannot bypass phase restrictions.
   */
  public canAccessRoute(routePage: string): {
    allowed: boolean;
    phaseRequired: LaunchPhase;
    lockMessage: string;
    moduleKey?: LaunchModuleKey;
  } {
    const routeToModuleMap: Record<string, LaunchModuleKey> = {
      's4-matrix': 's4',
      's4': 's4',
      'weekly_reward_starter': 'starter_reward',
      'starter': 'starter_reward',
      'quantum-nexus': 'quantum_nexus',
      'quantum': 'quantum_nexus',
      'nexus-prime': 'nexus_prime',
      'nexus': 'nexus_prime',
      'weekly_reward_premium': 'premium_reward',
      'premium': 'premium_reward',
      'weekly_passive_salary': 'salary',
      'salary': 'salary',
      'mbttc-trading': 'mbttc_trading',
    };

    const moduleKey = routeToModuleMap[routePage];
    if (!moduleKey) {
      // Unmapped routes (e.g. overview, hub, profile, team, transactions, etc.) are always allowed
      return { allowed: true, phaseRequired: 1, lockMessage: '' };
    }

    const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
    const allowed = this.isModuleUnlocked(moduleKey);

    return {
      allowed,
      phaseRequired: def.minPhase,
      lockMessage: getModuleLockMessage(moduleKey),
      moduleKey,
    };
  }

  /**
   * Tree Access Rule:
   * DEMO MODE: Tree accessible for testing if package active or demo override.
   * PRODUCTION: PROGRAM LIVE + USER PACKAGE ACTIVE = TREE ACCESS. Otherwise TREE LOCKED.
   */
  public isTreeAccessible(moduleKey: LaunchModuleKey, isUserPackageActive: boolean = true): boolean {
    if (!this.isModuleUnlocked(moduleKey)) {
      return false;
    }

    if (this.isDemoMode()) {
      return true;
    }

    return isUserPackageActive;
  }

  /**
   * MBTTC Live Rate Availability Rule:
   * Available starting in Phase 2 with S4 Matrix & Treasury IPO ecosystem connection.
   */
  public isMbttcLiveRateAvailable(): boolean {
    return this.activePhase >= 2;
  }

  /**
   * MBTTC Trading / DEX Swap Availability Rule:
   * Available starting in Phase 4.
   */
  public isMbttcTradingAvailable(): boolean {
    return this.activePhase >= 4;
  }

  /**
   * Get comprehensive phase status for any ecosystem module (Public Front & Dashboard)
   */
  public getModulePhaseStatus(moduleKey: LaunchModuleKey): {
    isUnlocked: boolean;
    minPhase: LaunchPhase;
    badge: string;
    statusLabel: string;
    lockMessage: string;
  } {
    const def = MODULE_LAUNCH_DEFINITIONS[moduleKey];
    const isUnlocked = this.isModuleUnlocked(moduleKey);
    const minPhase = def?.minPhase ?? 1;

    let statusLabel: string;
    let badge: string;

    if (isUnlocked) {
      statusLabel = '🟢 LIVE';
      badge = '🟢 LIVE';
    } else {
      statusLabel = minPhase === 4 ? '🔒 TRADING STARTS IN PHASE 4' : `🔒 UNLOCKS IN PHASE ${minPhase}`;
      badge = `🔒 PHASE ${minPhase}`;
    }

    return {
      isUnlocked,
      minPhase,
      badge,
      statusLabel,
      lockMessage: getModuleLockMessage(moduleKey),
    };
  }

  /**
   * Get comprehensive phase status for public package cards ($10, $25, $70, $120)
   */
  public getPackagePhaseStatus(packageType: 'junior' | 'senior' | 'quantum' | 'nexus'): {
    isUnlocked: boolean;
    minPhase: LaunchPhase;
    badge: string;
    actionLabel: string;
    lockMessage: string;
  } {
    const minPhase: LaunchPhase = (packageType === 'junior' || packageType === 'senior') ? 2 : 3;
    const isUnlocked = this.activePhase >= minPhase;

    return {
      isUnlocked,
      minPhase,
      badge: isUnlocked ? '🟢 AVAILABLE' : `🔒 UNLOCKS IN PHASE ${minPhase}`,
      actionLabel: isUnlocked ? 'EXPLORE' : `UNLOCKS IN PHASE ${minPhase}`,
      lockMessage: `This package unlocks after the Phase ${minPhase} community launch.`,
    };
  }

  /**
   * Reward claim gating:
   * Phase must be active.
   */
  public canClaimReward(moduleKey: LaunchModuleKey, isUserPackageActive: boolean = true): boolean {
    if (!this.isModuleUnlocked(moduleKey)) {
      return false;
    }

    if (this.isDemoMode()) {
      return true;
    }

    return isUserPackageActive;
  }
}

export const programPhaseService = new ProgramPhaseService();
