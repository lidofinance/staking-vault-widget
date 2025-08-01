import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

import { useMintFormData } from './mint-form-context';

import type { MintFormFieldValues } from './types';

export const Mintable = () => {
  const { mintableQuery } = useMintFormData();
  const { watch } = useFormContext<MintFormFieldValues>();
  const token = watch('token');
  const mintableAmount =
    token === 'stETH'
      ? mintableQuery.data?.maxMintableStETH
      : mintableQuery.data?.maxMintableShares;

  return (
    <InfoRowAmount
      title={vaultTexts.actions.mint.available}
      loading={mintableQuery.isPending}
      amount={mintableAmount}
      token={token}
      data-testid="availableToMintRow"
    />
  );
};
