import { AmountInfo, InfoRow, Wrapper } from './styles';
import { Loader } from '@lidofinance/lido-ui';
import { formatBalance } from 'utils';
import { useFormContext } from 'react-hook-form';
import { useRepayFormData } from 'features/adjustment/repay/repay-form-context';
import { useVaultInfo } from 'modules/vaults';
import { bigIntMin } from 'utils/bigint-math';

export const Balance = () => {
  const { watch } = useFormContext();
  const { isLoadingVault, error: vaultError, activeVault } = useVaultInfo();
  const {
    stEthBalance,
    wstEthBalance,
    isStEthLoading,
    isWstEthLoading,
    isStEthError,
    isWstEthError,
  } = useRepayFormData();
  const token = watch('token');
  const isSteth = token === 'stETH';

  const isError = (isSteth ? isStEthError : isWstEthError) || !!vaultError;

  const isLoading =
    (isSteth ? isStEthLoading : isWstEthLoading) || isLoadingVault;

  const balance = isSteth ? stEthBalance : wstEthBalance;

  const liability = isSteth
    ? activeVault?.liabilityStETH
    : activeVault?.liabilityShares;

  const availableToRepay = bigIntMin(liability ?? 0n, balance ?? 0n);

  return (
    <Wrapper>
      <InfoRow>
        <span>Available to repay</span>
        {isLoading && <Loader size="small" />}
        {!isLoading && !isError && (
          <AmountInfo>
            {formatBalance(availableToRepay).trimmed} {token}
          </AmountInfo>
        )}
        {isError && !isLoading && (
          <AmountInfo>{token} amount is not available</AmountInfo>
        )}
      </InfoRow>
    </Wrapper>
  );
};
