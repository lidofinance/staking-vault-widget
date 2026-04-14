import type { FC } from 'react';
import { Modal, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { VALIDATOR_MODALS } from 'features/validators/const';
import type { ModalData } from 'features/validators/contexts';
import {
  AvailableBalance,
  ContentContainer,
  ValidatorInfo,
} from 'features/validators/shared';

import { TopupModalForm } from './content';

type TopupModalProps = {
  modalData: ModalData | null;
  onCloseModal: () => void;
};

const { title, description, availableToTopup } =
  vaultTexts.actions.validators.modals.topUp;

export const TopupModal: FC<TopupModalProps> = ({
  modalData,
  onCloseModal,
}) => {
  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData;

  // TODO: get vault balance available for top up
  return (
    <Modal
      open={VALIDATOR_MODALS.topUpValidator === currentModal}
      onClose={onCloseModal}
      windowSize="md"
      title={title}
    >
      <ContentContainer>
        <Text size="xs">{description}</Text>
        <ValidatorInfo pubKey={pubKey} index={index} balance={balance} />
        <AvailableBalance title={availableToTopup} amount={balance} />
        <TopupModalForm index={index} balance={balance} />
      </ContentContainer>
    </Modal>
  );
};
