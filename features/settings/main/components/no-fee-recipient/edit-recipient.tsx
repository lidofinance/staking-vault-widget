import { vaultTexts } from 'modules/vaults';
import { AddressInputHookForm } from 'shared/hook-form/controls';

const texts = vaultTexts.actions.settings.fields.feeRecipient;

export const EditRecipient = () => {
  return (
    <AddressInputHookForm
      label={texts.editLabel}
      fieldName="feeRecipient"
      showRightDecorator={false}
    />
  );
};
