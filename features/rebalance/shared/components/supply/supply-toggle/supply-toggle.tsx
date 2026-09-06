import { useFormState } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { InputToggle } from 'shared/hook-form/controls';

export const SupplyToggle = () => {
  const { disabled } = useFormState();
  return (
    <InputToggle
      name="isSupplyEth"
      textOn={vaultTexts.actions.rebalance.supply.toggle}
      textOff={vaultTexts.actions.rebalance.supply.toggle}
      textPosition="right"
      textColor="default"
      size="xs"
      textStrong={false}
      disabled={disabled}
      data-testid="supply-toggle"
      showText
    />
  );
};
