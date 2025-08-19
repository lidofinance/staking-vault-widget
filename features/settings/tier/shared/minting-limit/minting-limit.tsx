import { Steth } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

import { TokenAmountInputGroup } from 'shared/hook-form/controls';
import { useVaultConfirmingRoles } from 'modules/vaults';
import { useTierData } from 'features/settings/tier/contexts';
import { vaultTexts } from 'modules/vaults/consts';

import { PartitionContainer } from '../partition-container';

export const MintingLimit = () => {
  const { hasNodeOperatorManager } = useVaultConfirmingRoles();
  const { values } = useTierData();

  const { watch } = useFormContext();
  const selectedTierId = watch('selectedTierId');

  // Disable input if the selected tier is the current tier
  const isCurrentTier = values?.vault.tierId.toString() === selectedTierId;
  const text = isCurrentTier
    ? vaultTexts.actions.tier.inputMintingLimit.titleCurrent
    : vaultTexts.actions.tier.inputMintingLimit.titleNew;

  if (!hasNodeOperatorManager) {
    return null;
  }

  return (
    <PartitionContainer title={text}>
      <TokenAmountInputGroup
        amountFieldName="vaultMintingLimit"
        label="stVault minting limit"
        showRightDecorator={false}
        leftDecorator={<Steth />}
        disabled={isCurrentTier}
      />
    </PartitionContainer>
  );
};
