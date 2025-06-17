import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

import type { WithdrawFormFieldValues } from './types';

export const TxInfo = () => {
  const { watch } = useFormContext<WithdrawFormFieldValues>();
  const [amount, token] = watch(['amount', 'token']);

  return (
    <InfoRowAmount
      title={vaultTexts.common.form.willReceiveLabel}
      amount={amount}
      token={token}
      noDataLabel="-"
    />
  );
};
