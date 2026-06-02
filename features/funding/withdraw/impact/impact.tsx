import { useState } from 'react';

import { VaultImpactDashboard, VaultImpactValuation } from 'shared/components';
import { GaugeQuestion, ImpactWrapper, InfoBlock } from './styles';

// TODO: research all Impact components and remove if it unused
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
