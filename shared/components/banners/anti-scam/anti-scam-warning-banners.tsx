import type { FC } from 'react';

import { useAntiScamBannerDefender } from './hooks';
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
  const state = useAntiScamBannerDefender(action);

  return (
    <>
      <NotOwnerWarning state={state} />
      <MultipleOwnersWarning state={state} />
      <UnguaranteedDepositsWarning state={state} />
    </>
  );
};
