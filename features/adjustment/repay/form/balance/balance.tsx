import { useFormContext } from 'react-hook-form';
import { useRepayFormData } from 'features/adjustment/repay/form/repay-form-context';
import { useVaultInfo, vaultTexts } from 'modules/vaults';
import { bigIntMin } from 'utils/bigint-math';
import { InfoRowAmount } from 'shared/components/form';

export const Balance = () => {
  const { watch } = useFormContext();
  const { isLoadingVault, activeVault } = useVaultInfo();
  const { stEthBalance, wstEthBalance, isStEthLoading, isWstEthLoading } =
    useRepayFormData();
  const token = watch('token');
  const isSteth = token === 'stETH';

  const isLoading =
    (isSteth ? isStEthLoading : isWstEthLoading) || isLoadingVault;

  const balance = isSteth ? stEthBalance : wstEthBalance;

  const liability = isSteth
    ? activeVault?.liabilityStETH
    : activeVault?.liabilityShares;

  const availableToRepay = bigIntMin(liability ?? 0n, balance ?? 0n);

  return (
    <InfoRowAmount
      title={vaultTexts.actions.repay.available}
      amount={availableToRepay}
      token={token}
      loading={isLoading}
    />
  );
};
