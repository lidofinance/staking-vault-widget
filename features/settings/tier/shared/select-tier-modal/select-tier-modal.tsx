import { FC } from 'react';
import { Modal } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { useNodeOperatorTiersInfo } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ReceiveReserveRatio } from '../receive-reserve-ratio';
import { TiersSelector } from './tiers-selector';

import { ContentWrapper } from './styles';

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

  // temporary disable RRR for now
  const isDisabledRRR = true;

  return (
    <Modal
      title="Select Tier"
      open={showModal}
      onClose={closeModal}
      windowSize="md"
    >
      <InlineLoader isLoading={isLoading} height={44}>
        <ContentWrapper>
          {isNodeOperatorConnected && isOnlyDefaultTier && !isDisabledRRR && (
            <ReceiveReserveRatio />
          )}
          <TiersSelector tiers={tiers} closeModal={closeModal} />
        </ContentWrapper>
      </InlineLoader>
    </Modal>
  );
};
