import { USDT_TOKEN_ADDRESS, MDEFI_HUB_ADDRESS } from '../data/contractConfig';
import { 
  playApprovalSuccessSound, 
  playPackageActivationSuccessSound, 
  playCongratulationsSound 
} from '../utils/successSound';

export interface IActivationStepResult {
  success: boolean;
  txHash: string;
  message?: string;
}

export type PackageActivationEventType =
  | 'USDT_APPROVAL_CONFIRMED'
  | 'PACKAGE_ACTIVATION_CONFIRMED'
  | 'FINAL_PACKAGE_SUCCESS_CONFIRMED';

export interface PackageActivationEventPayload {
  type: PackageActivationEventType;
  txHash: string;
  packageId?: string;
  packageName?: string;
  amountUsdt?: number;
  ownerAddress?: string;
  timestamp: number;
}

export type PackageActivationEventListener = (event: PackageActivationEventPayload) => void;

export interface IPackageActivationService {
  getUsdtContractAddress(): string;
  getSpenderContractAddress(): string;
  getAllowance(ownerAddress: string): Promise<number>;
  approveUsdt(ownerAddress: string, amountUsdt: number): Promise<IActivationStepResult>;
  activatePackage(packageId: string, amountUsdt: number, ownerAddress: string): Promise<IActivationStepResult>;
  subscribeToEvents(listener: PackageActivationEventListener): () => void;
  emitConfirmedEvent(event: PackageActivationEventPayload): void;
  isApprovalSoundPlayed(txHash: string): boolean;
  isActivationSoundPlayed(txHash: string): boolean;
  isFinalSuccessSoundPlayed(txHash: string): boolean;
}

class PackageActivationService implements IPackageActivationService {
  // In-memory allowance ledger to simulate on-chain ERC20 approve / transferFrom safety
  private allowances: Record<string, number> = {};

  // Transaction Identity Execution Guards
  // Stores transaction hashes that have already played their respective sounds.
  // Re-renders, state changes, component unmounts/remounts, or duplicate events
  // for the same transaction hash will NEVER replay the sound.
  private approvalSoundPlayedForTx = new Set<string>();
  private activationSoundPlayedForTx = new Set<string>();
  private finalSoundPlayedForActivation = new Set<string>();

  // Event listener registry
  private listeners = new Set<PackageActivationEventListener>();

  getUsdtContractAddress(): string {
    return USDT_TOKEN_ADDRESS;
  }

  getSpenderContractAddress(): string {
    return MDEFI_HUB_ADDRESS;
  }

  async getAllowance(ownerAddress: string): Promise<number> {
    await new Promise((r) => setTimeout(r, 60));
    return this.allowances[ownerAddress.toLowerCase()] || 0;
  }

  /**
   * Subscribe to package activation lifecycle events.
   * Returns a cleanup function that safely unregisters the listener.
   */
  public subscribeToEvents(listener: PackageActivationEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Dispatches a confirmed package activation event.
   * Notifies all listeners safely and evaluates sound playback
   * with strict transaction identity guards.
   */
  public emitConfirmedEvent(event: PackageActivationEventPayload): void {
    // 1. Notify listeners safely
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[PackageActivationService] Listener callback error:', err);
      }
    });

    // 2. Play sound strictly based on confirmed event and transaction identity
    this.handleEventSound(event);
  }

  private handleEventSound(event: PackageActivationEventPayload): void {
    const { type, txHash } = event;
    if (!txHash || txHash === '0x0') return;

    switch (type) {
      case 'USDT_APPROVAL_CONFIRMED': {
        if (this.approvalSoundPlayedForTx.has(txHash)) {
          // Already played for this exact transaction hash — prevent duplicate replay
          return;
        }
        console.log('[PACKAGE] Approval confirmed:', txHash);
        try {
          const played = playApprovalSuccessSound();
          if (played) {
            this.approvalSoundPlayedForTx.add(txHash);
            console.log('[SOUND] Approval success');
          }
        } catch (audioErr) {
          console.warn('[Sound] Audio error during approval:', audioErr);
        }
        break;
      }

      case 'PACKAGE_ACTIVATION_CONFIRMED': {
        if (this.activationSoundPlayedForTx.has(txHash)) {
          // Already played for this exact transaction hash — prevent duplicate replay
          return;
        }
        console.log('[PACKAGE] Activation confirmed:', txHash);
        try {
          const played = playPackageActivationSuccessSound();
          if (played) {
            this.activationSoundPlayedForTx.add(txHash);
            console.log('[SOUND] Activation success');
          }
        } catch (audioErr) {
          console.warn('[Sound] Audio error during activation:', audioErr);
        }
        break;
      }

      case 'FINAL_PACKAGE_SUCCESS_CONFIRMED': {
        if (this.finalSoundPlayedForActivation.has(txHash)) {
          // Already played for this exact transaction hash — prevent duplicate replay
          return;
        }
        console.log('[PACKAGE] Final activation state confirmed');
        try {
          const played = playCongratulationsSound();
          if (played) {
            this.finalSoundPlayedForActivation.add(txHash);
            console.log('[SOUND] Final success');
          }
        } catch (audioErr) {
          console.warn('[Sound] Audio error during final congratulations:', audioErr);
        }
        break;
      }
    }
  }

  public isApprovalSoundPlayed(txHash: string): boolean {
    return this.approvalSoundPlayedForTx.has(txHash);
  }

  public isActivationSoundPlayed(txHash: string): boolean {
    return this.activationSoundPlayedForTx.has(txHash);
  }

  public isFinalSuccessSoundPlayed(txHash: string): boolean {
    return this.finalSoundPlayedForActivation.has(txHash);
  }

  /**
   * Step 1: USDT Approval Flow
   * Simulates/executes standard BEP-20 approve(spender, amount)
   */
  async approveUsdt(ownerAddress: string, amountUsdt: number): Promise<IActivationStepResult> {
    // Await realistic blockchain wallet signature + block mining delay
    await new Promise((r) => setTimeout(r, 1200));

    const randomHex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const txHash = `0x${randomHex}`;

    // Record approved spending cap for contract safety verification
    this.allowances[ownerAddress.toLowerCase()] = amountUsdt;

    return {
      success: true,
      txHash,
      message: `Successfully approved ${amountUsdt} USDT spending cap for MDeFi Matrix Contract`,
    };
  }

  /**
   * Step 2: Node Activation Transaction
   * Verifies valid allowance first, then executes smart contract node placement
   */
  async activatePackage(
    packageId: string,
    amountUsdt: number,
    ownerAddress: string
  ): Promise<IActivationStepResult> {
    // Payment safety check: Ensure valid allowance exists before executing contract payment
    const currentAllowance = this.allowances[ownerAddress.toLowerCase()] || 0;
    if (currentAllowance < amountUsdt) {
      return {
        success: false,
        txHash: '',
        message: `Payment Safety Error: Contract is not authorized. Required allowance: $${amountUsdt} USDT, approved: $${currentAllowance} USDT. Please complete Step 1 Approval first.`,
      };
    }

    // Await block mining & validator confirmation delay
    await new Promise((r) => setTimeout(r, 1500));

    const randomHex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    const txHash = `0x${randomHex}`;

    // Reset or decrement allowance upon successful transferFrom execution
    this.allowances[ownerAddress.toLowerCase()] = Math.max(0, currentAllowance - amountUsdt);

    return {
      success: true,
      txHash,
      message: `Package ${packageId} activated successfully on BNB Smart Chain`,
    };
  }

  /**
   * Reset allowances (for test resets)
   */
  resetAllowances() {
    this.allowances = {};
  }
}

export const packageActivationService = new PackageActivationService();
