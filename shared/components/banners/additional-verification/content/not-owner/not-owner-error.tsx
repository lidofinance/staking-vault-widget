import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { UnidentifiedNodeOperator, DefaultTier } from '../../components';
import type { VerificationBannerState } from '../../types';

type NotOwnerErrorProps = {
  state: VerificationBannerState;
};

const { notOwner } = vaultTexts.actions.additionalVerification.banners;

export const NotOwnerError: FC<NotOwnerErrorProps> = ({ state }) => {
  if (!state.isNotOwnerErrorVisible) {
    return null;
  }

  return (
    <NoticeContainer
      title={notOwner.title}
      type="error"
      dataTestId="additionalVerification-notOwner-error-banner"
    >
      {state.isNodeOperatorVerified === false && (
        <UnidentifiedNodeOperator variant="notOwner" action={state.action} />
      )}
      {state.isTierDefault && state.isNodeOperatorVerified && (
        <DefaultTier variant="notOwner" action={state.action} />
      )}
    </NoticeContainer>
  );
};
