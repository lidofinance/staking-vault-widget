import { useFormContext } from 'react-hook-form';
import {
  AddressInputHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';

import { VAULT_MINT_TOKENS, vaultTexts } from 'modules/vaults';

import { useMintFormData } from './mint-form-context';
import { MintFormFieldValues } from './types';

export const MintFormInputs = () => {
  const { mintableQuery } = useMintFormData();
  const { watch } = useFormContext<MintFormFieldValues>();
  const token = watch('token');

  const maxValue =
    token === 'stETH'
      ? mintableQuery.data?.maxMintableStETH
      : mintableQuery.data?.maxMintableShares;

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_MINT_TOKENS}
        maxAmount={maxValue}
      />
      <AddressInputHookForm
        label={vaultTexts.actions.mint.recipientLabel}
        fieldName="recipient"
        data-testid="mintAddress"
      />
    </>
  );
};
