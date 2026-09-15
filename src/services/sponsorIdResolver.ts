/**
 * MDeFi Sponsor ID Resolver
 * 
 * Solves the architectural distinction between:
 * 1. Human-facing User Identifiers: "MDF-00109", "MDF-10001", "MDF-XXXXX"
 * 2. Smart Contract Blockchain Identifiers: uint256 numeric IDs (e.g., 109, 10001)
 * 
 * Provides decoupled bidirectional resolution, validation, and contract-ready translation.
 */

export interface ISponsorResolution {
  isValid: boolean;
  humanFacingId: string;
  numericId: number;
  isRootAdmin: boolean;
  isResolvedOnChain: boolean;
  sponsorAddress?: string;
  errorMessage?: string;
}

export class SponsorIdResolver {
  // Protocol Default Root Admin Identifier
  public static readonly ROOT_ADMIN_HUMAN_ID = 'MDF-00109';
  public static readonly ROOT_ADMIN_NUMERIC_ID = 109;

  /**
   * Validates and parses any sponsor input string
   */
  public validateSponsorId(input: string): { isValid: boolean; normalizedId: string; isRootAdmin: boolean } {
    if (!input || typeof input !== 'string') {
      return { isValid: false, normalizedId: '', isRootAdmin: false };
    }

    const cleaned = input.trim().toUpperCase();

    // Check Root Admin variations: "MDF-00109", "MDF-00109 (ADMIN)", "00109", "109"
    if (
      cleaned === SponsorIdResolver.ROOT_ADMIN_HUMAN_ID ||
      cleaned.startsWith('MDF-00109') ||
      cleaned === '00109' ||
      cleaned === '109'
    ) {
      return {
        isValid: true,
        normalizedId: SponsorIdResolver.ROOT_ADMIN_HUMAN_ID,
        isRootAdmin: true,
      };
    }

    // Standard pattern: MDF-XXXXX (where X is 1 to 8 digits)
    const mdfPattern = /^MDF-(\d{1,8})$/;
    const match = cleaned.match(mdfPattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > 0) {
        return {
          isValid: true,
          normalizedId: `MDF-${String(num).padStart(5, '0')}`,
          isRootAdmin: num === SponsorIdResolver.ROOT_ADMIN_NUMERIC_ID,
        };
      }
    }

    // Numeric-only input (e.g. "12345")
    const numericPattern = /^\d{1,8}$/;
    if (numericPattern.test(cleaned)) {
      const num = parseInt(cleaned, 10);
      if (num > 0) {
        return {
          isValid: true,
          normalizedId: `MDF-${String(num).padStart(5, '0')}`,
          isRootAdmin: num === SponsorIdResolver.ROOT_ADMIN_NUMERIC_ID,
        };
      }
    }

    return { isValid: false, normalizedId: cleaned, isRootAdmin: false };
  }

  /**
   * Resolves a human-facing ID into a blockchain numeric ID (uint256 equivalent)
   * Future mapping architecture:
   * MDF-XXXXX -> SponsorIdResolver -> On-chain Hub contract mapping / getter -> Official numeric blockchain ID
   */
  public async resolveSponsorNumericId(
    humanFacingOrRawId: string,
    hubContractInstance?: any
  ): Promise<ISponsorResolution> {
    const validation = this.validateSponsorId(humanFacingOrRawId);
    if (!validation.isValid) {
      return {
        isValid: false,
        humanFacingId: humanFacingOrRawId,
        numericId: 0,
        isRootAdmin: false,
        isResolvedOnChain: false,
        errorMessage: `Invalid Sponsor ID format: "${humanFacingOrRawId}". Must be in MDF-XXXXX format.`,
      };
    }

    // If a verified live Hub contract instance is passed and provides an official resolver method
    if (hubContractInstance && typeof hubContractInstance.resolveSponsorId === 'function') {
      try {
        const onChainNumericId = await hubContractInstance.resolveSponsorId(validation.normalizedId);
        const parsed = Number(onChainNumericId);
        if (!isNaN(parsed) && parsed > 0) {
          return {
            isValid: true,
            humanFacingId: validation.normalizedId,
            numericId: parsed,
            isRootAdmin: validation.isRootAdmin,
            isResolvedOnChain: true,
          };
        }
      } catch (err) {
        console.warn('[SponsorIdResolver] On-chain sponsor resolution error, falling back to canonical format:', err);
      }
    }

    // Canonical format extraction for Demo Mode & pre-deployment verification
    const match = validation.normalizedId.match(/^MDF-(\d+)$/);
    const numericId = match ? parseInt(match[1], 10) : SponsorIdResolver.ROOT_ADMIN_NUMERIC_ID;

    return {
      isValid: true,
      humanFacingId: validation.normalizedId,
      numericId,
      isRootAdmin: validation.isRootAdmin,
      isResolvedOnChain: false,
    };
  }

  /**
   * Converts a blockchain numeric ID (uint256) into a human-facing formatted ID
   */
  public formatToHumanFacingId(numericId: number | string): string {
    const num = typeof numericId === 'string' ? parseInt(numericId, 10) : numericId;
    if (isNaN(num) || num <= 0) {
      return SponsorIdResolver.ROOT_ADMIN_HUMAN_ID;
    }
    return `MDF-${String(num).padStart(5, '0')}`;
  }
}

export const sponsorIdResolver = new SponsorIdResolver();
