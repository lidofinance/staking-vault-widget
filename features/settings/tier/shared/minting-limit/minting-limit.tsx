import { InputAmount } from 'shared/components';

import { PartitionContainer } from '../partition-container';

export const MintingLimit = () => {
  return (
    <PartitionContainer title="Enter stVault minting limit">
      <InputAmount />
    </PartitionContainer>
  );
};
