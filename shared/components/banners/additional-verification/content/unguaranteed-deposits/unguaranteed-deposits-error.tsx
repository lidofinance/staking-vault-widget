import type { FC } from 'react';
import { Link, Text } from '@lidofinance/lido-ui';
import NextLink from 'next/link';

import { NoticeContainer } from '../../../../notice-container';
import { useVaultSettingsLink } from '../../hooks';
import { NO_IDENTIFICATION_LINK, PDG_LINK } from '../../const';
import type { VerificationBannerState } from '../../types';

type UnguaranteedDepositsErrorProps = {
  state: VerificationBannerState;
};

export const UnguaranteedDepositsError: FC<UnguaranteedDepositsErrorProps> = ({
  state,
}) => {
  const mainSettingsLink = useVaultSettingsLink('main');

  if (!state.isUnguaranteedDepositsErrorVisible || !state.nodeOperator) {
    return null;
  }

  return (
    <NoticeContainer
      title="Unguaranteed deposits allowed"
      type="error"
      dataTestId="additionalVerification-unguaranteedDeposits-error-banner"
    >
      <Text size="xxs">
        Operator {state.nodeOperator.toLowerCase()} has not passed the{' '}
        <Link href={NO_IDENTIFICATION_LINK}>identification process</Link>, and
        current <Link href={PDG_LINK}>Predeposit Guarantee Policy</Link> allows{' '}
        <NextLink
          href={mainSettingsLink}
          data-testid="additionalVerification-unguaranteedDeposits-link"
        >
          unguaranteed deposits
        </NextLink>
        . Due to a higher risk of losing funds, this action is not allowed in
        this UI.
      </Text>
    </NoticeContainer>
  );
};
