import type { FC } from 'react';
import { Modal, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import type { ModalData } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators//const';

import { WithdrawalType, WarningInfo, WithdrawalAction } from './components';

import {
  AvailableBalance,
  ContentContainer,
  ValidatorInfo,
} from '../components';

type WithdrawToVaultModalProps = {
  modalData: ModalData | null;
  onCloseModal: () => void;
};

const { title, description, availableToWithdraw } =
  vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModal: FC<WithdrawToVaultModalProps> = ({
  modalData,
  onCloseModal,
}) => {
  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData ?? {};

  const isPartial = VALIDATOR_MODALS.partialWithdrawal === currentModal;
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  return (
    <Modal
      open={isPartial || isFull}
      onClose={onCloseModal}
      windowSize="md"
      title={title}
    >
      <ContentContainer>
        <Text size="xs">{description}</Text>
        <ValidatorInfo pubKey={pubKey} index={index} balance={balance} />
        <WithdrawalType modalData={modalData} />
        <WarningInfo currentModal={currentModal} balance={balance} />
        <AvailableBalance title={availableToWithdraw} amount={balance} />
        <WithdrawalAction />
      </ContentContainer>
    </Modal>
  );
};
