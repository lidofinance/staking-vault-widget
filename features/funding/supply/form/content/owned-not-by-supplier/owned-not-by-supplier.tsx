import { Text } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useMitigateRisks } from 'modules/vaults';

export const OwnedNotBySupplier = () => {
  const { isVaultOwner } = useMitigateRisks();

  if (isVaultOwner) {
    return null;
  }

  return (
    <NoticeContainer title={'This stVault is not owned by you'} type="warning">
      <Text size="xxs">
        The permission to supply ETH to this stVault was delegated to your
        address by the Vault Owner.
      </Text>
    </NoticeContainer>
  );
};
