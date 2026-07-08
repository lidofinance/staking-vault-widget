import type { FC } from 'react';
import { useBreakpoint, Text, Address } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed } from '../../components';
import {
  VERIFICATION_CONFIRM_FIELD_NAMES,
  type VerificationBannerState,
} from '../../types';

type NotOwnerWarningProps = {
  state: VerificationBannerState;
};

const { notOwner } = vaultTexts.actions.additionalVerification.banners;

export const NotOwnerWarning: FC<NotOwnerWarningProps> = ({ state }) => {
  const isMobile = useBreakpoint('sm');
  const addressSize = isMobile ? 10 : 22;
  const token = state.action === 'repay' ? 'stETH' : 'ETH';

  if (!state.isNotOwnerWarningVisible || !state.firstAdmin) {
    return null;
  }

  return (
    <NoticeContainer
      title={notOwner.title}
      type="warning"
      dataTestId="additionalVerification-notOwner-warning-banner"
    >
      <Text size="xxs">
        The permission to {state.action} {token} in this stVault was delegated
        to your address by the Vault Owner.
      </Text>
      <Text size="xxs">
        Any tokens you supply will be fully controlled by the Vault Owner, and
        you will not be able to control or recover them.
      </Text>
      <Text size="xxs">
        Vault Owner:{' '}
        <Address
          as="span"
          style={{ fontWeight: 'bold' }}
          address={state.firstAdmin.toLowerCase()}
          symbols={addressSize}
        />
      </Text>
      <ConfirmAndProceed
        fieldName={VERIFICATION_CONFIRM_FIELD_NAMES.notOwner}
      />
    </NoticeContainer>
  );
};
