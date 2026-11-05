import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

// The fee is set on chain in basis points, so a percent is only meaningful up to 0.01%.
// Validation, the submit counter and the tx builder share these, so they agree on "changed".

const toBasisPointsExact = (percent: number | string) =>
  // toFixed drops float noise (e.g. 0.57 * 100 = 56.99999999999999)
  Number(((Number(percent) * VAULT_TOTAL_BASIS_POINTS) / 100).toFixed(6));

// floor drops precision beyond basis points
export const feePercentToBasisPoints = (percent: number | string) =>
  Math.floor(toBasisPointsExact(percent));

// false for e.g. 1.001%: it would be sent as 1%, so it must be rejected, not silently rounded
export const isWholeBasisPoints = (percent: number | string) =>
  Number.isInteger(toBasisPointsExact(percent));

// empty or missing values are not a fee, so they never equal one
export const isSameFee = (
  a: number | string | undefined,
  b: number | string | undefined,
) =>
  a !== undefined &&
  b !== undefined &&
  a !== '' &&
  b !== '' &&
  feePercentToBasisPoints(a) === feePercentToBasisPoints(b);
