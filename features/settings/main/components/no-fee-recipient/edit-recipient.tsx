import { useController } from 'react-hook-form';
import { Input, Identicon } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { isAddress } from 'viem';

const texts = vaultTexts.actions.settings.fields.nodeOperatorFeeRecipient;

export const EditRecipient = () => {
  const {
    field,
    fieldState: { error },
  } = useController({ name: 'nodeOperatorFeeRecipient' });

  return (
    <Input
      {...field}
      leftDecorator={
        isAddress(field.value) ? <Identicon address={field.value} /> : null
      }
      label={texts.editLabel}
      error={error?.message}
      fullwidth
    />
  );
};
