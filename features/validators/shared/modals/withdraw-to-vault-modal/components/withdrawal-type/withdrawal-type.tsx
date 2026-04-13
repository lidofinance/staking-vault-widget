import { type FC, useCallback } from 'react';
import { Switcher, SwitcherItem } from '@lidofinance/lido-ui';

import {
  type ModalData,
  useValidatorModal,
} from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';

import { TypeWrapper } from './styles';

type WithdrawalTypeProps = {
  modalData: ModalData;
};

export const WithdrawalType: FC<WithdrawalTypeProps> = ({ modalData }) => {
  const { openModal } = useValidatorModal();
  const { currentModal } = modalData;
  const isPartial = VALIDATOR_MODALS.partialWithdrawal === currentModal;
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  const openPartialWithdrawal = useCallback(() => {
    openModal({
      ...modalData,
      currentModal: VALIDATOR_MODALS.partialWithdrawal,
    });
  }, [openModal, modalData]);

  const openFullWithdrawal = useCallback(() => {
    openModal({
      ...modalData,
      currentModal: VALIDATOR_MODALS.fullWithdrawal,
    });
  }, [openModal, modalData]);

  return (
    <TypeWrapper>
      <Switcher>
        <SwitcherItem active={isPartial} onClick={openPartialWithdrawal}>
          Partial withdrawal
        </SwitcherItem>
        <SwitcherItem active={isFull} onClick={openFullWithdrawal}>
          Full withdrawal
        </SwitcherItem>
      </Switcher>
    </TypeWrapper>
  );
};
