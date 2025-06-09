import { Wrapper } from './styles';
import { useFormContext } from 'react-hook-form';
import { AllowanceDataTableRow } from 'shared/components/allowance-data-table-row';
import { useAllowance } from 'modules/web3';
import { useTokenAddress } from 'shared/hooks/use-token-address';
import { useVaultInfo } from 'modules/vaults';

export const FeatureTxInfo = () => {
  const { watch } = useFormContext();
  const { activeVault } = useVaultInfo();
  const [token] = watch(['token']);
  const tokenAddress = useTokenAddress(token);

  const { data } = useAllowance({
    token: tokenAddress,
    spender: activeVault?.owner,
  });

  return (
    <Wrapper>
      <AllowanceDataTableRow token={token} allowance={data} />
    </Wrapper>
  );
};
