import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/contexts';

export const StethLiabilityModal = () => {
  const {
    values: {
      utilizationRatio,
      totalMintingCapacityStETH,
      remainingMintingCapacity,
      reserveRatio,
      rebalanceThreshold,
      tierLimitStETH,
    },
  } = useVaultOverview();

  return (
    <OverviewModal name="liabilityStETH">
      <SectionDivider />
      <ModalSection
        title={'Utilization ratio'}
        amount={utilizationRatio}
        description={
          'The share of the stETH minting capacity currently utilized by the vault owner.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Total stETH minting capacity'}
        subTitle={'constrained by Reserve Ratio'}
        amount={totalMintingCapacityStETH}
        description={
          'The amount of stETH the Vault Owner can mint within the Reserve Ratio boundaries. Also limited by the stETH minting limit.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'stETH minting limit'}
        amount={tierLimitStETH}
        description={
          'Absolute maximum limit for the stETH minting capacity defined by the Tier the vaults belong to. It can be changed by changing the Tier.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Remaining capacity'}
        amount={remainingMintingCapacity}
        description={
          'The amount of stETH remaining mintable in the vault, based on the current Total stETH minting capacity and stETH Liability.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Reserve Ratio'}
        amount={reserveRatio}
        description={
          'Defines amount of ETH that will be reserved as a part of collateral when the vault owner mints stETH in the vault.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Forced Rebalance Threshold'}
        amount={rebalanceThreshold}
        description={
          'Defines the minimum allowed ratio stETH Liability to Total Value. Exceeding this minimum threshold makes the vault subject to forced rebalancing.'
        }
      />
    </OverviewModal>
  );
};
