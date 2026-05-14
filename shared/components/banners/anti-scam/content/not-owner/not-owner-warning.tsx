import type { FC } from 'react';
import { useBreakpoint, Text, Address } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed } from '../../components';
import {
  ANTI_SCAM_CONFIRM_FIELD_NAMES,
  type AntiScamBannerState,
} from '../../types';

type NotOwnerWarningProps = {
  state: AntiScamBannerState;
};

const { notOwner } = vaultTexts.actions.antiScam.banners;

export const NotOwnerWarning: FC<NotOwnerWarningProps> = ({ state }) => {
  const isMobile = useBreakpoint('sm');
  const addressSize = isMobile ? 10 : 22;

  if (!state.isNotOwnerWarningVisible || !state.firstAdmin) {
    return null;
  }

  return (
    <NoticeContainer title={notOwner.title} type="warning">
      <Text size="xxs">
        The permission to {state.action} ETH in this stVault was delegated to
        your address by the Vault Owner.
      </Text>
      <Text size="xxs">
        Any tokens you use for this action will be fully controlled by the Vault
        Owner, and you will not be able to control or recover them.
      </Text>
      <Text size="xxs">
        Vault Owner:{' '}
        <Address
          as="span"
          style={{ fontWeight: 'bold' }}
          address={state.firstAdmin}
          symbols={addressSize}
        />
      </Text>
      <ConfirmAndProceed fieldName={ANTI_SCAM_CONFIRM_FIELD_NAMES.notOwner} />
    </NoticeContainer>
  );
};
