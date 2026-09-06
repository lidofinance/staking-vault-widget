import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed, OwnersList } from '../../components';
import {
  type VerificationBannerState,
  VERIFICATION_CONFIRM_FIELD_NAMES,
} from '../../types';

type WithdrawalPermissionWarningProps = {
  state: VerificationBannerState;
};

const { title, description, ownersListTitle } =
  vaultTexts.actions.additionalVerification.banners.withdrawalPermission;

export const WithdrawalPermissionWarning: FC<
  WithdrawalPermissionWarningProps
> = ({ state }) => {
  if (
    !state.isWithdrawalPermissionWarningVisible ||
    !state.otherWithdrawersList?.length
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title={title}
      type="warning"
      dataTestId="additionalVerification-withdrawalPermission-warning-banner"
    >
      <Text size="xxs">{description}</Text>
      <OwnersList
        ownersList={state.otherWithdrawersList}
        title={ownersListTitle}
        testIdPrefix="withdrawalPermission"
      />
      <ConfirmAndProceed
        fieldName={VERIFICATION_CONFIRM_FIELD_NAMES.withdrawalPermission}
      />
    </NoticeContainer>
  );
};
