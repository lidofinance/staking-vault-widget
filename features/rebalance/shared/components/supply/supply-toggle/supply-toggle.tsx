import { vaultTexts } from 'modules/vaults';
import { InputToggle } from 'shared/hook-form/controls';

export const SupplyToggle = () => {
  return (
    <InputToggle
      name="isSupplyEth"
      textOn={vaultTexts.actions.rebalance.supply.toggle}
      textOff={vaultTexts.actions.rebalance.supply.toggle}
      textPosition="right"
      textColor="default"
      size="xs"
      textStrong={false}
      data-testid="supplyEthToggle"
      showText
    />
  );
};
