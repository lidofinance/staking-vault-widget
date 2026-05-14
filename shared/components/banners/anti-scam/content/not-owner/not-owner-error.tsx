import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults/consts/texts';

import { NoticeContainer } from '../../../../notice-container';
import { UnidentifiedNodeOperator, DefaultTier } from '../../components';
import type { AntiScamBannerState } from '../../types';

type NotOwnerErrorProps = {
  state: AntiScamBannerState;
};

const { notOwner } = vaultTexts.actions.antiScam.banners;

export const NotOwnerError: FC<NotOwnerErrorProps> = ({ state }) => {
  if (!state.isNotOwnerErrorVisible) {
    return null;
  }

  return (
    <NoticeContainer title={notOwner.title} type="error">
      {state.isNodeOperatorVerified === false && (
        <UnidentifiedNodeOperator variant="notOwner" action={state.action} />
      )}
      {state.isTierDefault && state.isNodeOperatorVerified && (
        <DefaultTier variant="notOwner" action={state.action} />
      )}
    </NoticeContainer>
  );
};
