import { FC } from 'react';
import { Modal } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';

import { useNodeOperatorTiersInfo } from 'features/settings/tier/hooks';
import { ReceiveReserveRatio } from '../receive-reserve-ratio';
import { TiersSelector } from './tiers-selector';

import { ContentWrapper, InlineLoaderStyled } from './styles';

type SelectTierModalProps = {
  showModal: boolean;
  closeModal: () => void;
};

export const SelectTierModal: FC<SelectTierModalProps> = ({
  showModal,
  closeModal,
}) => {
  const { address } = useDappStatus();
  const { data: nodeOperatorTiersInfo, isLoading } = useNodeOperatorTiersInfo();
  const { group, tiers } = nodeOperatorTiersInfo ?? {};
  const isNodeOperatorConnected = address === group?.nodeOperator;

  const isOnlyDefaultTier = tiers?.length === 1 && tiers[0].id === 0n;

  return (
    <Modal
      title="Select Tier"
      open={showModal}
      onClose={closeModal}
      windowSize="md"
    >
      {isLoading ? (
        <InlineLoaderStyled />
      ) : (
        <ContentWrapper>
          {isNodeOperatorConnected && isOnlyDefaultTier && (
            <ReceiveReserveRatio />
          )}
          <TiersSelector tiers={tiers} />
        </ContentWrapper>
      )}
    </Modal>
  );
};
