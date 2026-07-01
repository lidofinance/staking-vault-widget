import { useVerificationBannerDefender } from './use-verification-banner-state';

import type { AdditionalVerificationAction } from '../types';

export const useDisableFormByVerification = (
  action: AdditionalVerificationAction,
): boolean => {
  const state = useVerificationBannerDefender(action);
  return (
    state.isNotOwnerErrorVisible ||
    state.isMultipleOwnersErrorVisible ||
    state.isUnguaranteedDepositsErrorVisible
  );
};
