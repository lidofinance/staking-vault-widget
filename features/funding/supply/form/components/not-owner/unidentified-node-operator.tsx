import { Text } from '@lidofinance/lido-ui';

export const UnidentifiedNodeOperator = () => {
  return (
    <Text size="xxs">
      This stVault is not owned by you, and the permission to supply ETH was
      delegated to your address by the Vault Owner. Additionally, this stVault
      is associated with an unidentified Node Operator. This interface does not
      allow supplying ETH, repaying stETH, or rebalancing in this case due to a
      higher risk of fund loss.
    </Text>
  );
};
