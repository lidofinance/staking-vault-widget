import { FC, useMemo } from 'react';

import { useMainSettingsData } from '../contexts';

import { RadioSelector } from './radio-selector';
import { VotingBlock } from './voting-form.styles';

export const VotingForm: FC = () => {
  const mainSettingsData = useMainSettingsData();

  const nodeOperatorFeeBP = useMemo(() => {
    return mainSettingsData?.nodeOperatorFeeBP;
  }, [mainSettingsData]);

  const confirmExpiry = useMemo(() => {
    return mainSettingsData?.confirmExpiry;
  }, [mainSettingsData]);

  return (
    <div>
      <VotingBlock>
        <RadioSelector
          data={nodeOperatorFeeBP}
          radioType="nodeOperatorFeeBP"
          title="Node Operator Fee"
        />
      </VotingBlock>
      <VotingBlock>
        <RadioSelector
          data={confirmExpiry}
          radioType="confirmExpiry"
          title="Confirmation Lifetime"
        />
      </VotingBlock>
    </div>
  );
};
