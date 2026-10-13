import { vaultTexts } from 'modules/vaults';
import { useEthereumBalance, useAA, BALANCE_PADDING } from 'modules/web3';

export const useEthBalanceWarning = (amount?: bigint | null) => {
  const { data: balance } = useEthereumBalance();
  const { isAA } = useAA();

  return !isAA &&
    typeof amount === 'bigint' &&
    typeof balance === 'bigint' &&
    amount <= balance &&
    balance - amount < BALANCE_PADDING
    ? vaultTexts.common.warnings.balanceWarning
    : undefined;
};
