import { vaultTexts } from './texts';

const errorTexts = vaultTexts.common.errors.vault;

export class DisplayableError extends Error {
  public originalError?: Error;
  public isRetryable: boolean;
  public errorTitle?: string;

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

//

export class SendTxGetStatusError extends DisplayableError {
  constructor(error?: unknown) {
    super(vaultTexts.common.errors.tx.getStatus, false, error as Error);
    this.name = 'SendTxGetStatusError';
    this.errorTitle = vaultTexts.common.errors.tx.getStatusTitle;
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
