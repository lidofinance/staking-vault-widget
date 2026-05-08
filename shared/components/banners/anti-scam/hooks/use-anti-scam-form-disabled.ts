import { useAntiScamBannerState } from './use-anti-scam-banner-state';

import type { AntiScamAction } from '../types';

export const useAntiScamFormDisabled = (action: AntiScamAction): boolean => {
  const state = useAntiScamBannerState(action);
  return (
    state.isNotOwnerErrorVisible ||
    state.isMultipleOwnersErrorVisible ||
    state.isUnguaranteedDepositsErrorVisible
  );
};
