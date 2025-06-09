import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';

import { useMintFormData } from './mint-form-context';

import type { MintFormFieldValues } from './types';

export const Mintable = () => {
  const { mintableQuery } = useMintFormData();
  const { watch } = useFormContext<MintFormFieldValues>();
  const token = watch('token');
  const mintableAmount =
    token === 'stETH'
      ? mintableQuery.data?.mintableStETH
      : mintableQuery.data?.mintableWstETH;

  return (
    <InfoRowAmount
      label="Available to mint"
      amount={mintableAmount}
      token={token}
    />
  );
};
