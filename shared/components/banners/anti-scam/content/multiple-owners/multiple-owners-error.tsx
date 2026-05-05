import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { DefaultTier, UnidentifiedNodeOperator } from '../../components';
import type { AntiScamBannerState } from '../../types';

type MultipleOwnersErrorProps = {
  state: AntiScamBannerState;
};

const { title } = vaultTexts.actions.antiScam.banners.multipleOwners;

export const MultipleOwnersError: FC<MultipleOwnersErrorProps> = ({
  state,
}) => {
  if (!state.isMultipleOwnersErrorVisible) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="error">
      {state.isTierDefault && <DefaultTier variant="multipleOwners" />}
      {state.isNodeOperatorVerified === false && (
        <UnidentifiedNodeOperator variant="multipleOwners" />
      )}
    </NoticeContainer>
  );
};
