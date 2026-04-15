import type { FC } from 'react';
import { Modal, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { WEI_PER_ETHER } from 'consts/tx';

import {
  AvailableBalance,
  ContentContainer,
  ValidatorInfo,
} from 'features/validators/shared';
import type { ModalData } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';

import { WithdrawalType, WarningInfo } from './components';
import { WithdrawToVaultModalForm } from './content';

type WithdrawToVaultModalProps = {
  modalData: ModalData | null;
  onCloseModal: () => void;
};

const { title, description, availableToWithdraw } =
  vaultTexts.actions.validators.modals.withdrawal;

const MIN_ACTIVATION_BALANCE = WEI_PER_ETHER * 32n;

export const WithdrawToVaultModal: FC<WithdrawToVaultModalProps> = ({
  modalData,
  onCloseModal,
}) => {
  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData;
  const availableToPartialWithdraw =
    balance >= MIN_ACTIVATION_BALANCE ? balance - MIN_ACTIVATION_BALANCE : 0n;
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
        {isPartial && (
          <AvailableBalance
            title={availableToWithdraw}
            amount={availableToPartialWithdraw}
          />
        )}
        <WithdrawToVaultModalForm isPartial={isPartial} pubkey={pubKey} />
      </ContentContainer>
    </Modal>
  );
};
