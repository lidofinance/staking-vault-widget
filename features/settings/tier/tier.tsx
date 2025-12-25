import { VotingRequest, TierInfo } from 'features/settings/tier/components';
import {
  TierDataProvider,
  TierFormProvider,
} from 'features/settings/tier/contexts';

import { TierPage } from './styles';

export const TierSettings = () => {
  return (
    <TierDataProvider>
      <TierFormProvider>
        <TierPage>
          <VotingRequest />
          <TierInfo />
        </TierPage>
      </TierFormProvider>
    </TierDataProvider>
  );
};
