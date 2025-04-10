import { useDappStatus } from 'modules/web3';

import { Input } from '@lidofinance/lido-ui';
import { CurrentAddressButton } from './current-address-button';
import { useController, useFormContext } from 'react-hook-form';

export const AddressField = () => {
  const { address } = useDappStatus();
  const { field } = useController({ name: 'recipient' });
  const { setValue } = useFormContext();

  const handleSetAddress = () => {
    setValue('recipient', address);
  };

  return (
    <Input
      {...field}
      label="Claim to address"
      rightDecorator={
        <CurrentAddressButton
          onClick={handleSetAddress}
          disabled={field.value === address}
        />
      }
    />
  );
};
