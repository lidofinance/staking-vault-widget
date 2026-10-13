import type { FC } from 'react';

import { NoticeContainer } from '../../../../notice-container';
import { WarningBannerText } from './warning-banner-text';
import type { VerificationBannerState } from '../../types';

type UnguaranteedDepositsWarningProps = {
  state: VerificationBannerState;
};

export const UnguaranteedDepositsWarningWithErrors: FC<
  UnguaranteedDepositsWarningProps
> = ({ state }) => {
  const { isUnguaranteedDepositsWarningVisible, isErrorBannerVisible } = state;

  if (!isUnguaranteedDepositsWarningVisible || !isErrorBannerVisible) {
    return null;
  }

  return (
    <NoticeContainer
      title="Unguaranteed deposits allowed"
      dataTestId="additionalVerification-unguaranteedDeposits-warningWithErrors-banner"
    >
      <WarningBannerText />
    </NoticeContainer>
  );
};
