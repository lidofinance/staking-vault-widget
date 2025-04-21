import { parseEther } from 'viem';

export const VAULTS_PER_PAGE = 4;

export const VAULTS_CONNECT_DEPOSIT = parseEther('1');

// TOOD: remove in favor on bigint only calc
export const VAULT_TOTAL_BASIS_POINTS = 10_000;
export const VAULT_TOTAL_BASIS_POINTS_BN = 10_000n;
