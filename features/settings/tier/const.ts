import { z } from 'zod';

export const tierSettingsFormSchema = z.object({
  selectedTierId: z.string(),
  vaultMintingLimit: z.number(),
});

const WEI_IN_ETH = 10n ** 18n;
const ONE_THOUSAND = 1_000n;
const ONE_MILLION = 1_000_000n;

export const formatWeiToEthShort = (
  wei: bigint | undefined | string,
  token: 'stETH' | 'ETH' = 'ETH',
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
