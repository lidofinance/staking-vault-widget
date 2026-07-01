import type { FC } from 'react';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed } from '../../components';
import { WarningBannerText } from './warning-banner-text';
import {
  type VerificationBannerState,
  VERIFICATION_CONFIRM_FIELD_NAMES,
} from '../../types';

type UnguaranteedDepositsWarningProps = {
  state: VerificationBannerState;
};

export const UnguaranteedDepositsWarning: FC<
  UnguaranteedDepositsWarningProps
> = ({ state }) => {
  const { isUnguaranteedDepositsWarningVisible, isErrorBannerVisible } = state;

  if (!isUnguaranteedDepositsWarningVisible || isErrorBannerVisible) {
    return null;
  }

  return (
    <NoticeContainer title="Unguaranteed deposits allowed">
      <WarningBannerText />
      <ConfirmAndProceed
        fieldName={VERIFICATION_CONFIRM_FIELD_NAMES.unguaranteedDeposits}
      />
    </NoticeContainer>
  );
};
