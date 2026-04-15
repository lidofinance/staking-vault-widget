import type { FC } from 'react';
import { Modal, Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { vaultTexts } from 'modules/vaults';

import { VALIDATOR_MODALS } from 'features/validators/const';
import { ModalData, useValidators } from 'features/validators/contexts';
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
  const { availableBalance } = useValidators();
  if (!modalData) {
    return null;
  }

  const { currentModal, pubKey, index, balance } = modalData;

  return (
    <Modal
      open={VALIDATOR_MODALS.topUpValidator === currentModal}
      onClose={onCloseModal}
      windowSize="md"
      title={title}
    >
      <ContentContainer>
        <Text size="xs">{description}</Text>
        <ValidatorInfo pubKey={pubKey} index={index} balance={balance}>
          <Text size="xxs" color="secondary">
            Available stVault Balance
          </Text>
          <Text size="xxs" strong>
            <FormatToken amount={availableBalance} symbol="ETH" />
          </Text>
        </ValidatorInfo>
        <AvailableBalance title={availableToTopup} amount={availableBalance} />
        <TopupModalForm
          index={index}
          pubkey={pubKey}
          balance={availableBalance}
        />
      </ContentContainer>
    </Modal>
  );
};
