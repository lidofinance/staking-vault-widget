import { FC } from 'react';

import { vaultTexts } from 'modules/vaults';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { RadioSelector } from '../controllers/radio-selector';
import { VotingBlock } from './styles';

export const Voting: FC = () => {
  const { data } = useMainSettingsData();

  return (
    <VotingBlock>
      <RadioSelector
        data={data?.nodeOperatorFeeRate}
        vaultKey="nodeOperatorFeeRate"
        title={vaultTexts.actions.settings.fields.nodeOperatorFeeRate.title}
      />
      <RadioSelector
        data={data?.confirmExpiry}
        vaultKey="confirmExpiry"
        title={vaultTexts.actions.settings.fields.confirmationLifetime.title}
      />
    </VotingBlock>
  );
};
