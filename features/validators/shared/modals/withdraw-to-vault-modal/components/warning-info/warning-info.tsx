import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { WEI_PER_ETHER } from 'consts/tx';
import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';

import { useValidatorModal } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';

import { IconWrapper, WarmingContainer } from './styles';

const { partialWarning, fullWarning } =
  vaultTexts.actions.validators.modals.withdrawal;

export const WarningInfo = () => {
  const { currentModal } = useValidatorModal();
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  return (
    <WarmingContainer>
      <IconWrapper>
        <WarningRing />
      </IconWrapper>
      <Text size="xxs">
        {isFull ? fullWarning(WEI_PER_ETHER) : partialWarning}
      </Text>
    </WarmingContainer>
  );
};
