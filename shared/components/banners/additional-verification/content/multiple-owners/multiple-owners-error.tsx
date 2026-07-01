import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { DefaultTier, UnidentifiedNodeOperator } from '../../components';
import type { VerificationBannerState } from '../../types';

type MultipleOwnersErrorProps = {
  state: VerificationBannerState;
};

const { title } =
  vaultTexts.actions.additionalVerification.banners.multipleOwners;

export const MultipleOwnersError: FC<MultipleOwnersErrorProps> = ({
  state,
}) => {
  if (!state.isMultipleOwnersErrorVisible) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="error">
      {state.isNodeOperatorVerified === false && (
        <UnidentifiedNodeOperator
          variant="multipleOwners"
          action={state.action}
        />
      )}
      {state.isTierDefault && state.isNodeOperatorVerified && (
        <DefaultTier variant="multipleOwners" action={state.action} />
      )}
    </NoticeContainer>
  );
};
