import {
  RequestChangeLimit,
  TierInfo,
} from 'features/settings/tier/components';
import {
  TierDataProvider,
  TierFormProvider,
} from 'features/settings/tier/contexts';

import { TierPage } from './styles';

export const TierSettings = () => {
  return (
    <TierDataProvider>
      <TierPage>
        <RequestChangeLimit />
        <TierFormProvider>
          <TierInfo />
        </TierFormProvider>
      </TierPage>
    </TierDataProvider>
  );
};
