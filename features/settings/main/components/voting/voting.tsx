import { FC, useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { RadioSelector } from '../controllers/radio-selector';
import { VotingBlock } from './styles';

export const Voting: FC = () => {
  const mainSettingsData = useMainSettingsData();

  const [nodeOperatorFeeBP, confirmExpiry] = useMemo(() => {
    return [
      mainSettingsData?.nodeOperatorFeeBP,
      mainSettingsData?.confirmExpiry,
    ];
  }, [mainSettingsData]);

  return (
    <VotingBlock>
      <RadioSelector
        data={nodeOperatorFeeBP}
        vaultKey="nodeOperatorFeeBP"
        title={vaultTexts.actions.settings.fields.nodeOperatorFee.title}
      />
      <RadioSelector
        data={confirmExpiry}
        vaultKey="confirmExpiry"
        title={vaultTexts.actions.settings.fields.confirmationLifetime.title}
      />
    </VotingBlock>
  );
};
