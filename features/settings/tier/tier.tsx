import {
  RequestChangeLimit,
  TierInfo,
} from 'features/settings/tier/components';

import { TierPage } from './styles';

export const TierSettings = () => {
  // TODO:
  // data provider
  // form provider
  return (
    <TierPage>
      <RequestChangeLimit />
      <TierInfo />
    </TierPage>
  );
};
