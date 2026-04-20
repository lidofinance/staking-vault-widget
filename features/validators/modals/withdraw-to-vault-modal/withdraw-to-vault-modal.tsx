import type { FC } from 'react';
import { Modal, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { bigIntMax } from 'utils/bigint-math';

import { ContentContainer, ValidatorInfo } from 'features/validators/shared';
import type { ModalData } from 'features/validators/contexts';
import {
  MIN_ACTIVATION_BALANCE,
  VALIDATOR_MODALS,
} from 'features/validators/const';

import { WithdrawalType } from './components';
import { WithdrawToVaultModalForm } from './content';

type WithdrawToVaultModalProps = {
  modalData: ModalData | null;
  onCloseModal: () => void;
};

const { title, description } = vaultTexts.actions.validators.modals.withdrawal;

export const WithdrawToVaultModal: FC<WithdrawToVaultModalProps> = ({
  modalData,
  onCloseModal,
}) => {
  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData;
  const availableToPartialWithdraw = bigIntMax(
    0n,
    balance - MIN_ACTIVATION_BALANCE,
  );
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
        <WithdrawToVaultModalForm
          isPartial={isPartial}
          availableToPartialWithdraw={availableToPartialWithdraw}
          pubkey={pubKey}
        />
      </ContentContainer>
    </Modal>
  );
};
