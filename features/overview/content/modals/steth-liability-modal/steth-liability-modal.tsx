import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  ModalSection,
  OverviewModal,
  SectionDivider,
  useStEthChart,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

const { liabilityStETH } = vaultTexts.metrics.modals;

const dataTestIdPrefix = 'liabilityStETH-modal';

export const StethLiabilityModal = () => {
  const chartData = useStEthChart();
  const { isLoadingVault, values } = useVaultOverview();

  const {
    utilizationRatio,
    totalMintingCapacityStETH,
    remainingMintingCapacityStETH,
    reserveRatio,
    rebalanceThreshold,
    tierLimitStETH,
    vaultData,
  } = values || {};

  return (
    <OverviewModal name="liabilityStETH">
      <ChartLine
        loading={isLoadingVault}
        border={ChartLineBorderType.rounded}
        thresholdType={ChartLineThresholdType.flag}
        data={chartData}
        height={16}
        showLabels
        data-testid={`${dataTestIdPrefix}-chart`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.utilizationRatio.title}
        amount={utilizationRatio}
        description={liabilityStETH.utilizationRatio.description}
        dataTestId={`${dataTestIdPrefix}-utilizationRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.totalStethMintingCapacity.title}
        subTitle={liabilityStETH.totalStethMintingCapacity.constrainedBy(
          vaultData?.mintingConstraintBy || 'vault',
        )}
        amount={totalMintingCapacityStETH}
        description={liabilityStETH.totalStethMintingCapacity.description}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingCapacitySection`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.stethMintingLimit.title}
        amount={tierLimitStETH}
        description={liabilityStETH.stethMintingLimit.description}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingLimitSection`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.remainingCapacity.title}
        amount={remainingMintingCapacityStETH}
        description={liabilityStETH.remainingCapacity.description}
        dataTestId={`${dataTestIdPrefix}-remainingCapacitySection`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.reserveRatio.title}
        amount={reserveRatio}
        description={liabilityStETH.reserveRatio.description}
        dataTestId={`${dataTestIdPrefix}-reserveRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.forcedRebalanceThreshold.title}
        amount={rebalanceThreshold}
        description={liabilityStETH.forcedRebalanceThreshold.description}
        dataTestId={`${dataTestIdPrefix}-forcedRebalanceThresholdSection`}
      />
    </OverviewModal>
  );
};
