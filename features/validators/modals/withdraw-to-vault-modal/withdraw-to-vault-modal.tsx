import { type FC, useState, useCallback } from 'react';
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
  const [withdrawalType, setWithdrawalType] = useState<'partial' | 'full'>(
    'partial',
  );

  const handleCloseModal = useCallback(() => {
    onCloseModal();
    setWithdrawalType('partial');
  }, [onCloseModal]);

  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData;
  const isPartial = withdrawalType === 'partial';
  const availableToPartialWithdraw = bigIntMax(
    0n,
    balance - MIN_ACTIVATION_BALANCE,
  );

  return (
    <Modal
      open={VALIDATOR_MODALS.withdrawalToVault === currentModal}
      onClose={handleCloseModal}
      windowSize="md"
      title={<span data-testid="title">{title}</span>}
      data-testid="validators-withdrawal-modal"
    >
      <ContentContainer>
        <Text size="xs" data-testid="description">
          {description}
        </Text>
        <ValidatorInfo pubKey={pubKey} index={index} balance={balance} />
        <WithdrawalType value={withdrawalType} onChange={setWithdrawalType} />
        <WithdrawToVaultModalForm
          isPartial={isPartial}
          availableToPartialWithdraw={availableToPartialWithdraw}
          pubkey={pubKey}
        />
      </ContentContainer>
    </Modal>
  );
};
