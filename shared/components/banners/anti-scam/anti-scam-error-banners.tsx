import type { FC } from 'react';

import { useAntiScamBannerState } from './hooks';

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
  const state = useAntiScamBannerState(action);

  return (
    <>
      <NotOwnerError state={state} />
      <MultipleOwnersError state={state} />
      <UnguaranteedDepositsError state={state} />
      <UnguaranteedDepositsWarningWithErrors state={state} />
    </>
  );
};
