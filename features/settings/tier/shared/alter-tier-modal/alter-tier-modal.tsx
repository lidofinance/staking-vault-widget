import type { FC } from 'react';
import { Modal } from '@lidofinance/lido-ui';

import { useAlterTier } from 'features/settings/tier/hooks';
import { BaseMetrics } from '../vault-metrics/base-metrics';
import {
  TierLimits,
  ModalSubtitle,
  ApplyChanges,
  MainInfo,
} from './components';

import { Container, DividerStyled } from './styles';

type AlterTierModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export const AlterTierModal: FC<AlterTierModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const { data: alterTierData } = useAlterTier();

  if (!alterTierData) {
    return null;
  }

  const { tierName, alterTierList } = alterTierData;

  return (
    <Modal
      title={`${tierName} update`}
      subtitle={<ModalSubtitle alterTierList={alterTierList} />}
      open={isOpen}
      onClose={closeModal}
      windowSize="md"
      data-testid="syncTier-modal"
    >
      <DividerStyled />
      <Container data-testid="syncTier-modal-content">
        <TierLimits />
        <DividerStyled />
        <BaseMetrics />
        <DividerStyled />
        <MainInfo alterTierList={alterTierList} />
        <ApplyChanges closeModal={closeModal} />
      </Container>
    </Modal>
  );
};
