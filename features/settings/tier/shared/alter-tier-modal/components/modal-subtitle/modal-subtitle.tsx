import type { FC } from 'react';

import type { VaultTierData } from 'features/settings/tier/hooks';
import { AlterTierChanges } from 'features/settings/tier/shared';

import { Container } from './styles';

type ModalSubtitleProps = {
  alterTierList: VaultTierData['alterTierList'];
};

export const ModalSubtitle: FC<ModalSubtitleProps> = ({ alterTierList }) => {
  return (
    <Container data-testid="syncTier-modal-subtitle">
      <AlterTierChanges
        alterTierList={alterTierList}
        dataTestId="syncTier-modal-subtitle"
      />
    </Container>
  );
};
