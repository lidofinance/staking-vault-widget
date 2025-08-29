const WEI_IN_ETH = 10n ** 18n;
const ONE_THOUSAND = 1_000n;
const ONE_MILLION = 1_000_000n;

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

export const formatWeiToEthShort = (
  wei: bigint | undefined | string,
  token: 'stETH' | 'ETH' | 'ETH' | '' = '',
) => {
  if (typeof wei === 'undefined') return wei;
  if (typeof wei === 'string') wei = BigInt(wei);
  if (wei < 0n) return `0 ${token}`;

  const ethAmount = wei / WEI_IN_ETH;

  if (ethAmount < ONE_THOUSAND) return `${ethAmount} ${token}`;

  if (ethAmount < ONE_MILLION) {
    const thousands = ethAmount / ONE_THOUSAND;
    return `${thousands}K ${token}`;
  }

  const millions = ethAmount / ONE_MILLION;
  return `${millions}M ${token}`;
};
