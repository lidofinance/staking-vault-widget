import { Text } from '@lidofinance/lido-ui';

export const TransferDescription = () => {
  return (
    <Text size="xs" data-testid="description">
      Disconnection is completed. To be able to withdraw the connection deposit,
      now you need to abandon the Dashboard contract and transfer the ownership
      to a new address.
    </Text>
  );
};
