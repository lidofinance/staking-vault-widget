import { Switcher, SwitcherItem } from '@lidofinance/lido-ui';

import { useValidatorModal } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';

import { TypeWrapper } from './styles';

export const WithdrawalType = () => {
  const { currentModal, openModal } = useValidatorModal();
  const isPartial = VALIDATOR_MODALS.partialWithdrawal === currentModal;
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  return (
    <TypeWrapper>
      <Switcher>
        <SwitcherItem
          active={isPartial}
          onClick={() => openModal(VALIDATOR_MODALS.partialWithdrawal)}
        >
          Partial withdrawal
        </SwitcherItem>
        <SwitcherItem
          active={isFull}
          onClick={() => openModal(VALIDATOR_MODALS.fullWithdrawal)}
        >
          Full withdrawal
        </SwitcherItem>
      </Switcher>
    </TypeWrapper>
  );
};
