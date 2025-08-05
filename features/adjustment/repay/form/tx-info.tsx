import { useFormContext } from 'react-hook-form';

import { useAA, useAllowance } from 'modules/web3';
import { useVault } from 'modules/vaults';

import { useTokenAddress } from 'shared/hooks/use-token-address';
import { InfoRowAllowance } from 'shared/components/form';

export const TxInfo = () => {
  const { isAA } = useAA();
  const { watch } = useFormContext();
  const { activeVault } = useVault();

  const [token] = watch(['token']);
  const tokenAddress = useTokenAddress(token);

  const { data } = useAllowance({
    token: tokenAddress,
    spender: activeVault?.owner,
  });

  if (isAA) return null;

  return (
    <InfoRowAllowance
      token={token}
      allowance={data}
      data-testid="allowanceRow"
    />
  );
};
