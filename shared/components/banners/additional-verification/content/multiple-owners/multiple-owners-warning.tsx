import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { ConfirmAndProceed, Explanation, OwnersList } from '../../components';
import {
  type VerificationBannerState,
  VERIFICATION_CONFIRM_FIELD_NAMES,
} from '../../types';

type MultipleOwnersWarningProps = {
  state: VerificationBannerState;
};

const { title, description } =
  vaultTexts.actions.additionalVerification.banners.multipleOwners;

export const MultipleOwnersWarning: FC<MultipleOwnersWarningProps> = ({
  state,
}) => {
  if (
    !state.isMultipleOwnersWarningVisible ||
    !state.defaultAdminList?.length
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title={title}
      type="warning"
      dataTestId="additionalVerification-multipleOwners-warning-banner"
    >
      <Text size="xxs">{description}</Text>
      <Explanation />
      <OwnersList ownersList={state.defaultAdminList} />
      <ConfirmAndProceed
        fieldName={VERIFICATION_CONFIRM_FIELD_NAMES.multipleOwners}
      />
    </NoticeContainer>
  );
};
