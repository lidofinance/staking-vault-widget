import type { FC } from 'react';

import { useAntiScamBannerDefender } from './hooks';

import type { AntiScamAction } from './types';
import {
  MultipleOwnersError,
  NotOwnerError,
  UnguaranteedDepositsError,
  UnguaranteedDepositsWarningWithErrors,
} from './content';

type AntiScamBannersProps = {
  action: AntiScamAction;
};

export const AntiScamErrorBanners: FC<AntiScamBannersProps> = ({ action }) => {
  const state = useAntiScamBannerDefender(action);

  return (
    <>
      <NotOwnerError state={state} />
      <MultipleOwnersError state={state} />
      <UnguaranteedDepositsError state={state} />
      <UnguaranteedDepositsWarningWithErrors state={state} />
    </>
  );
};
