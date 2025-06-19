import { FC, useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { RadioSelector } from '../controllers/radio-selector';
import { VotingBlock } from './styles';

export const Voting: FC = () => {
  const mainSettingsData = useMainSettingsData();

  const [nodeOperatorFeeRate, confirmExpiry] = useMemo(() => {
    return [
      mainSettingsData?.nodeOperatorFeeRate,
      mainSettingsData?.confirmExpiry,
    ];
  }, [mainSettingsData]);

  return (
    <VotingBlock>
      <RadioSelector
        data={nodeOperatorFeeRate}
        vaultKey="nodeOperatorFeeRate"
        title={vaultTexts.actions.settings.fields.nodeOperatorFeeRate.title}
      />
      <RadioSelector
        data={confirmExpiry}
        vaultKey="confirmExpiry"
        title={vaultTexts.actions.settings.fields.confirmationLifetime.title}
      />
    </VotingBlock>
  );
};
