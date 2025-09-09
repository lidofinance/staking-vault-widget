const WEI_IN_ETH = 10n ** 18n;
const ONE = 1;
const ONE_THOUSAND = 1_000;
const ONE_MILLION = 1_000_000;

export const shortenTokenValue = (value: number) => {
  const ceilValue = Math.ceil(value);
  if (value <= 0) return '0';
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q'];
  // calc a suffix but cap at last one
  const suffixNum = Math.min(
    Math.floor(
      // this prevents scientific notation at large numbers
      (ceilValue.toLocaleString('fullwide', { useGrouping: false }).length -
        1) /
        3,
    ),
    suffixes.length - 1,
  );
  const suffix = suffixes[suffixNum];

  let shortValue = parseFloat(
    (ceilValue / Math.pow(10, suffixNum * 3)).toFixed(1),
  );

  if (shortValue % 1 !== 0) {
    shortValue = Number(shortValue.toFixed(1));
  }
  return `${shortValue}${suffix}`;
};

const formatValue = (value: number) => {
  return value.toFixed(2).replace(/\.?0+$/, '');
};

export const formatWeiToEthShort = (
  wei: bigint | undefined | string,
  token: 'stETH' | 'ETH' | '' = '',
): string | undefined => {
  if (typeof wei === 'undefined') return wei;
  if (typeof wei === 'string') wei = BigInt(wei);
  if (wei < 0n) return `0 ${token}`;

  const eth = Number(wei) / Number(WEI_IN_ETH);

  if (eth < ONE || eth < ONE_THOUSAND) {
    return `${formatValue(eth)} ${token}`;
  }

  if (eth < ONE_MILLION) {
    return `${formatValue(eth / ONE_THOUSAND)}K ${token}`;
  }

  return `${formatValue(eth / ONE_MILLION)}M ${token}`;
};
