import { parseEther } from 'viem';

export const VAULTS_PER_PAGE = 6;

export const VAULTS_CONNECT_DEPOSIT = parseEther('1');

// TOOD: remove in favor on bigint only calc
export const VAULT_TOTAL_BASIS_POINTS = 10_000;
export const VAULT_TOTAL_BASIS_POINTS_BN = 10_000n;
export const VAULT_DEFAULT_REPORT_FRESHNESS_DELTA = 86400n; // 24 hours
export const VAULT_SHOULD_REPORT_THRESHOLD = 0.9; // 90% of time until report is not fresh anymore has passed

// forms validation values
export const MIN_FEE_VALUE = 0;
export const MAX_FEE_VALUE = 99.99;
export const MIN_CONFIRM_EXPIRY = 24;
export const MIN_CONFIRM_EXPIRY_SECONDS = 24 * 3600;
export const MAX_CONFIRM_EXPIRY = 24 * 30;
export const MAX_CONFIRM_EXPIRY_SECONDS = 24 * 30 * 3600;
