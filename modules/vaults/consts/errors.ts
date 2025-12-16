import { vaultTexts } from './texts';

const errorTexts = vaultTexts.common.errors.vault;

export class DisplayableError extends Error {
  public originalError?: Error;
  public isRetryable: boolean;

  constructor(message: string, isRetryable = true, originalError?: Error) {
    super(message);
    this.name = 'GenericDisplayableError';
    this.originalError = originalError;
    this.isRetryable = isRetryable;
  }

  public originalErrorString(): string {
    return this.originalError ? this.originalError.toString() : '';
  }
}

// Vault Fetch

export class VaultAddressError extends DisplayableError {
  constructor() {
    super(errorTexts.vaultAddress, false);
    this.name = 'VaultAddressError';
  }
}

export class VaultOwnerNotDashboardError extends DisplayableError {
  constructor() {
    super(errorTexts.notDashboard, false);
    this.name = 'VaultNotDashboard';
  }
}

export class ReportMissingError extends DisplayableError {
  constructor() {
    super(errorTexts.reportMissing, false);
    this.name = 'ReportMissing';
  }
}
