import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import type { RiskVariant } from '../../types';

type UnidentifiedNodeOperatorProps = {
  variant: RiskVariant;
};

export const UnidentifiedNodeOperator: FC<UnidentifiedNodeOperatorProps> = ({
  variant,
}) => {
  if (variant === 'multipleOwners') {
    return (
      <Text size="xxs">
        The Vault Owner role (DEFAULT_ADMIN_ROLE) is assigned to one or more
        other addresses, and this stVault is associated with an unidentified
        Node Operator. This UI does not allow supplying ETH, repaying stETH, or
        rebalancing in this case due to a higher risk of fund loss.
      </Text>
    );
  }

  return (
    <Text size="xxs">
      This stVault is not owned by you, and the permission to perform this
      action was delegated to your address by the Vault Owner. Additionally,
      this stVault is associated with an unidentified Node Operator. This
      interface does not allow supplying ETH, repaying stETH, or rebalancing in
      this case due to a higher risk of fund loss.
    </Text>
  );
};
