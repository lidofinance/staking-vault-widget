export const HEALTH_EMERGENCY_GUIDE_LINK =
  'https://docs.lido.fi/run-on-lido/stvaults/operational-and-management-guides/health-emergency-guide';

// keep in sync with vaultTexts...quarantinedHint.learnMoreLink in modules/vaults/consts/texts.ts
export const QUARANTINE_GUIDE_LINK =
  'https://docs.lido.fi/run-on-lido/stvaults/concepts-and-reference/how-quarantine-works';

export const modals = [
  'totalValueETH',
  'healthFactorNumber',
  'netApr',
  'balance',
  'withdrawableEther',
  'undisbursedNodeOperatorFee',
  'unsettledLidoFees',
  'vaultLiabilityStETH',
] as const;
