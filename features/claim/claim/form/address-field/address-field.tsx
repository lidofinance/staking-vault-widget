import { Input } from '@lidofinance/lido-ui';
import { CurrentAddressButton } from './current-address-button';

export const AddressField = () => {
  return (
    <Input label="Claim to address" rightDecorator={<CurrentAddressButton />} />
  );
};
