import { Text } from '@lidofinance/lido-ui';

export const UnidentifiedNodeOperator = () => {
  return (
    <Text size="xxs">
      The Vault Owner role (DEFAULT_ADMIN_ROLE) is assigned to one or more other
      addresses, and this stVault is associated with an unidentified Node
      Operator. This UI does not allow supplying ETH, repaying stETH, or
      rebalancing in this case due to a higher risk of fund loss.
    </Text>
  );
};
