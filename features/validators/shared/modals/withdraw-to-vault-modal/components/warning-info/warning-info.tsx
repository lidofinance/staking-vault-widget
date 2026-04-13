import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';

import { VALIDATOR_MODALS } from 'features/validators/const';
import type { ValidatorsModalItem } from 'features/validators/types';

import { IconWrapper, WarmingContainer } from './styles';

type WarningInfoProps = {
  currentModal: ValidatorsModalItem;
  balance: bigint;
};

const { partialWarning, fullWarning } =
  vaultTexts.actions.validators.modals.withdrawal;

export const WarningInfo: FC<WarningInfoProps> = ({
  currentModal,
  balance,
}) => {
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  return (
    <WarmingContainer>
      <IconWrapper>
        <WarningRing />
      </IconWrapper>
      <Text size="xxs">{isFull ? fullWarning(balance) : partialWarning}</Text>
    </WarmingContainer>
  );
};
