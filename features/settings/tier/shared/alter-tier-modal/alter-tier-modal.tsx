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
  showModal: boolean;
  closeModal: () => void;
};

export const AlterTierModal: FC<AlterTierModalProps> = ({
  showModal,
  closeModal,
}) => {
  const { data: alterTierData } = useAlterTier();

  if (!alterTierData) {
    return null;
  }

  const { id, alterTierList } = alterTierData;

  return (
    <Modal
      title={`Tier ${id} update`}
      subtitle={<ModalSubtitle alterTierList={alterTierList} />}
      open={showModal}
      onClose={closeModal}
      windowSize="md"
    >
      <DividerStyled />
      <Container>
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
