import { InputGroup } from '@lidofinance/lido-ui';
import { useController, useFormContext } from 'react-hook-form';
import { InputAmount } from 'shared/components';

import { TokenSelectHookForm } from 'shared/hook-form/controls/token-select-hook-form';
import { useMintFormData } from 'features/adjustment/mint/mint-form-context';
import { VAULT_MINT_TOKENS } from 'modules/vaults';

export const AmountField = () => {
  const { mintableStETH, mintableWstETH } = useMintFormData();
  const { field } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const token = watch('token');
  const maxValue = token === 'stETH' ? mintableStETH : mintableWstETH;

  // TODO: add errors
  return (
    <>
      <InputGroup>
        <TokenSelectHookForm options={VAULT_MINT_TOKENS} />
        <InputAmount {...field} label={`${token} amount`} maxValue={maxValue} />
      </InputGroup>
    </>
  );
};
