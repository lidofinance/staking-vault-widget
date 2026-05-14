import type { FC } from 'react';

import { NoticeContainer } from '../../../../notice-container';
import { WarningBannerText } from './warning-banner-text';
import type { AntiScamBannerState } from '../../types';

type UnguaranteedDepositsWarningProps = {
  state: AntiScamBannerState;
};

export const UnguaranteedDepositsWarningWithErrors: FC<
  UnguaranteedDepositsWarningProps
> = ({ state }) => {
  const { isUnguaranteedDepositsWarningVisible, isErrorBannerVisible } = state;

  if (!isUnguaranteedDepositsWarningVisible || !isErrorBannerVisible) {
    return null;
  }

  return (
    <NoticeContainer title="Unguaranteed deposits allowed">
      <WarningBannerText />
    </NoticeContainer>
  );
};
