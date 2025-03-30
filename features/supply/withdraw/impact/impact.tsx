import { useState } from 'react';

import { VaultImpactDashboard, VaultImpactValuation } from 'shared/components';
import { GaugeQuestion, ImpactWrapper, InfoBlock } from './styles';

export const Impact = () => {
  const [step] = useState(150);

  return (
    <ImpactWrapper>
      <InfoBlock>
        <GaugeQuestion />
        <VaultImpactDashboard percentage={step} />
      </InfoBlock>
      <InfoBlock>
        <VaultImpactValuation />
      </InfoBlock>
    </ImpactWrapper>
  );
};
