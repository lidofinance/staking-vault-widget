import { VAULT_MINT_TOKENS } from 'modules/vaults';
import { TokenAmountInputGroup } from 'shared/hook-form/controls';

import { useRepayForm } from './repay-form-context';

export const RepayFormInputs = () => {
  const { maxRepayable } = useRepayForm();

  return (
    <TokenAmountInputGroup
      amountFieldName="amount"
      tokenFieldName="token"
      errorFieldName="amount"
      maxAmount={maxRepayable}
      tokenOptions={VAULT_MINT_TOKENS}
    />
  );
};
