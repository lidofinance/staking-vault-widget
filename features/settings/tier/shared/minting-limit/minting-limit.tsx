import { Steth } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import { TokenAmountInputGroup } from 'shared/hook-form/controls';
import { useVaultConfirmingRoles } from 'modules/vaults';
import { useTierData } from 'features/settings/tier/contexts';
import { vaultTexts } from 'modules/vaults/consts';

import { PartitionContainer } from '../partition-container';
import { TierSettingsFormValues } from '../../types';

export const MintingLimit = () => {
  const { values } = useTierData();
  const { isNodeOperator } = useVaultConfirmingRoles();

  const selectedTierId = useWatch<TierSettingsFormValues>({
    name: 'selectedTierId',
  });

  // Disable input if the selected tier is the current tier
  const isCurrentTier = values?.vault.tierId.toString() === selectedTierId;
  const text = isCurrentTier
    ? vaultTexts.actions.tier.inputMintingLimit.titleCurrent
    : vaultTexts.actions.tier.inputMintingLimit.titleNew;

  if (!isNodeOperator) {
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
