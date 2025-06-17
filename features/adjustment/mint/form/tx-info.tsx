import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';

import { InfoRowAmount } from 'shared/components/form/info-row-amount';

import type { MintFormFieldValues } from './types';

export const TxInfo = () => {
  const { watch } = useFormContext<MintFormFieldValues>();
  const [token, amount] = watch(['token', 'amount']);

  return (
    <InfoRowAmount
      title={vaultTexts.common.form.willReceiveLabel}
      amount={amount}
      token={token}
      noDataLabel="-"
    />
  );
};
