import { useAntiScamBannerDefender } from './use-anti-scam-banner-state';

import type { AntiScamAction } from '../types';

export const useDisableFormByAntiScam = (action: AntiScamAction): boolean => {
  const state = useAntiScamBannerDefender(action);
  return (
    state.isNotOwnerErrorVisible ||
    state.isMultipleOwnersErrorVisible ||
    state.isUnguaranteedDepositsErrorVisible
  );
};
