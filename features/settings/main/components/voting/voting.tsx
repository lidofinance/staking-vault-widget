import { FC } from 'react';

import { useVault, vaultTexts } from 'modules/vaults';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { RadioSelector } from '../controllers/radio-selector';
import { VotingBlock } from './styles';

export const Voting: FC = () => {
  const { data } = useMainSettingsData();
  const { activeVault } = useVault();

  return (
    <VotingBlock>
      <RadioSelector
        data={data?.feeRate}
        deactivated={activeVault?.isPendingDisconnect}
        vaultKey="feeRate"
        title={vaultTexts.actions.settings.fields.feeRate.title}
      />
      <RadioSelector
        data={data?.confirmExpiry}
        vaultKey="confirmExpiry"
        title={vaultTexts.actions.settings.fields.confirmationLifetime.title}
      />
    </VotingBlock>
  );
};
