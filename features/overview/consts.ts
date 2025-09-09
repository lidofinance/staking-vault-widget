export const modals = [
  'totalValue',
  'healthFactorNumber',
  'netApr',
  'balance',
  'withdrawableEther',
  'undisbursedNodeOperatorFee',
  'unsettledLidoFees',
  'vaultLiability',
] as const;

export const formatCustomDate = (timestampSeconds: number): string => {
  const date = new Date(timestampSeconds * 1000);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'shortOffset',
  });
  return formatter.format(date);
};
