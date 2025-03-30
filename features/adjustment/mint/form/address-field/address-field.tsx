import { Input } from '@lidofinance/lido-ui';
import { CurrentAddressButton } from './current-address-button';
import { useController, useFormContext } from 'react-hook-form';
import { useDappStatus } from 'modules/web3';

export const AddressField = () => {
  const { field } = useController({ name: 'address' });
  const { setValue } = useFormContext();
  const { address } = useDappStatus();

  const handleSetCurrentAddress = () => {
    setValue(field.name, address, {
      shouldValidate: true,
    });
  };

  return (
    <Input
      {...field}
      label="Mint to address"
      rightDecorator={
        <CurrentAddressButton
          onClick={handleSetCurrentAddress}
          disabled={!address}
        />
      }
    />
  );
};
