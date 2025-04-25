import { parseEther } from 'viem';

export const VAULTS_PER_PAGE = 6;

export const VAULTS_CONNECT_DEPOSIT = parseEther('1');

// TOOD: remove in favor on bigint only calc
export const VAULT_TOTAL_BASIS_POINTS = 10_000;
export const VAULT_TOTAL_BASIS_POINTS_BN = 10_000n;

// forms validation values
export const MIN_FEE_VALUE = 0.01;
export const MAX_FEE_VALUE = 99;
export const MIN_CONFIRM_EXPIRY = 24;
export const MAX_CONFIRM_EXPIRY = 24 * 30;
