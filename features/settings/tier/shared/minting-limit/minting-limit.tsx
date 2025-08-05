import { Steth } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form/controls';
import { useVaultConfirmingRoles } from 'modules/vaults';

import { PartitionContainer } from '../partition-container';

export const MintingLimit = () => {
  const { hasNodeOperatorManager } = useVaultConfirmingRoles();

  if (!hasNodeOperatorManager) {
    return null;
  }

  return (
    <PartitionContainer title="Enter stVault minting limit">
      <TokenAmountInputGroup
        amountFieldName="vaultMintingLimit"
        label="stVault minting limit"
        showRightDecorator={false}
        leftDecorator={<Steth />}
      />
    </PartitionContainer>
  );
};
