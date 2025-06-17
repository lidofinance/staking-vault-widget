import { useController } from 'react-hook-form';
import { Input } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

const texts = vaultTexts.actions.settings.fields.nodeOperatorFeeRecipient;

export const EditRecipient = () => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: 'nodeOperatorFeeRecipient' });

  return (
    <Input
      {...field}
      placeholder={texts.editLabel}
      error={error?.message}
      fullwidth
    />
  );
};
