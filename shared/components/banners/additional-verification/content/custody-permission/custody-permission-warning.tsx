import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed, RoleAddressesList } from '../../components';
import {
  type VerificationBannerState,
  VERIFICATION_CONFIRM_FIELD_NAMES,
} from '../../types';

type CustodyPermissionWarningProps = {
  state: VerificationBannerState;
};

const { title, description } =
  vaultTexts.actions.additionalVerification.banners.custodyPermission;

export const CustodyPermissionWarning: FC<CustodyPermissionWarningProps> = ({
  state,
}) => {
  if (
    !state.isCustodyPermissionWarningVisible ||
    !state.custodyRoleMembers?.length
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title={title}
      type="warning"
      dataTestId="additionalVerification-custodyPermission-warning-banner"
    >
      <Text size="xxs">{description}</Text>
      <RoleAddressesList
        entries={state.custodyRoleMembers}
        testIdPrefix="custodyPermission"
      />
      <ConfirmAndProceed
        fieldName={VERIFICATION_CONFIRM_FIELD_NAMES.custodyPermission}
      />
    </NoticeContainer>
  );
};
