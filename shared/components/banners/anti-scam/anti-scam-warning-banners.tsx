import type { FC } from 'react';

import { useAntiScamBannerState } from './hooks';
import {
  MultipleOwnersWarning,
  NotOwnerWarning,
  UnguaranteedDepositsWarning,
} from './content';
import type { AntiScamAction } from './types';

type AntiScamBannersProps = {
  action: AntiScamAction;
};

export const AntiScamWarningBanners: FC<AntiScamBannersProps> = ({
  action,
}) => {
  const state = useAntiScamBannerState(action);

  return (
    <>
      <NotOwnerWarning state={state} />
      <MultipleOwnersWarning state={state} />
      <UnguaranteedDepositsWarning state={state} />
    </>
  );
};
