import { FC, useMemo } from 'react';

import { useMainSettingsData } from 'features/settings/main/contexts';
import { RadioSelector } from '../controllers/radio-selector';
import { VotingBlock } from './styles';

export const Voting: FC = () => {
  const mainSettingsData = useMainSettingsData();

  const nodeOperatorFeeBP = useMemo(() => {
    return mainSettingsData?.nodeOperatorFeeBP;
  }, [mainSettingsData]);

  const confirmExpiry = useMemo(() => {
    return mainSettingsData?.confirmExpiry;
  }, [mainSettingsData]);

  return (
    <VotingBlock>
      <RadioSelector
        data={nodeOperatorFeeBP}
        radioType="nodeOperatorFeeBP"
        title="Node Operator Fee"
      />
      <RadioSelector
        data={confirmExpiry}
        radioType="confirmExpiry"
        title="Confirmation Lifetime"
      />
    </VotingBlock>
  );
};
