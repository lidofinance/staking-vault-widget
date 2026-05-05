import type { FC } from 'react';
import { Link, Text } from '@lidofinance/lido-ui';
import NextLink from 'next/link';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed } from '../../components';
import { useVaultSettingsLink } from '../../hooks';
import { PDG_LINK } from '../../const';
import {
  type AntiScamBannerState,
  ANTI_SCAM_CONFIRM_FIELD_NAMES,
} from '../../types';

type UnguaranteedDepositsWarningProps = {
  state: AntiScamBannerState;
};

export const UnguaranteedDepositsWarning: FC<
  UnguaranteedDepositsWarningProps
> = ({ state }) => {
  const mainSettingsLink = useVaultSettingsLink('main');

  if (!state.isUnguaranteedDepositsWarningVisible) {
    return null;
  }

  return (
    <NoticeContainer title="Unguaranteed deposits allowed">
      <Text size="xxs">
        Current <Link href={PDG_LINK}>Predeposit Guarantee Policy</Link> allows{' '}
        <NextLink href={mainSettingsLink}>unguaranteed deposits</NextLink>. By
        proceeding, you confirm that there is mutual off-chain trust between the
        Node Operator and the Vault Owner.
      </Text>
      <ConfirmAndProceed
        fieldName={ANTI_SCAM_CONFIRM_FIELD_NAMES.unguaranteedDeposits}
      />
    </NoticeContainer>
  );
};
