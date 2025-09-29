import { vaultTexts } from 'modules/vaults';
import { AddressInputHookForm } from 'shared/hook-form/controls';

import { RecipientEtherscan } from './recipient-etherscan';

const texts = vaultTexts.actions.settings.fields.nodeOperatorFeeRecipient;

export const EditRecipient = () => {
  return (
    <AddressInputHookForm
      label={texts.editLabel}
      fieldName="nodeOperatorFeeRecipient"
      rightDecorator={<RecipientEtherscan />}
      showRightDecorator
    />
  );
};
