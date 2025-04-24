import { Input } from '@lidofinance/lido-ui';
import { CurrentAddressButton } from './current-address-button';
import { useDappStatus } from 'modules/web3';
import { useController, useFormContext } from 'react-hook-form';

export const AddressField = () => {
  const { setValue } = useFormContext();
  const { field } = useController({ name: 'recipient' });
  const { address } = useDappStatus();

  const handleSetAddress = () => {
    setValue('recipient', address);
  };

  // TODO: add error handler
  return (
    <Input
      {...field}
      label="Withdraw to address"
      rightDecorator={
        <CurrentAddressButton
          onClick={handleSetAddress}
          disabled={field.value === address}
        />
      }
    />
  );
};
