import { InputToggle } from 'shared/hook-form/controls';

export const SupplyToggle = () => {
  return (
    <InputToggle
      name="isSupplyEth"
      textOn="Supply ETH"
      textOff="Supply ETH"
      textPosition="right"
      textColor="default"
      size="xs"
      textStrong={false}
      data-testid="supplyEthToggle"
      showText
    />
  );
};
