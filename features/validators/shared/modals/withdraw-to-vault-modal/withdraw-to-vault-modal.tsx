import { Modal } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { useValidatorModal } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators//const';

import {
  Description,
  ValidatorInfo,
  WithdrawalType,
  WarningInfo,
  WithdrawalAmount,
  WithdrawalAction,
} from './components';
import { Container } from './styles';

const { title } = vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModal = () => {
  const { currentModal, closeModal } = useValidatorModal();
  const isPartial = VALIDATOR_MODALS.partialWithdrawal === currentModal;
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  return (
    <Modal
      open={isPartial || isFull}
      onClose={closeModal}
      windowSize="md"
      title={title}
    >
      <Container>
        <Description />
        <ValidatorInfo />
        <WithdrawalType />
        <WarningInfo />
        <WithdrawalAmount />
        <WithdrawalAction />
      </Container>
    </Modal>
  );
};
