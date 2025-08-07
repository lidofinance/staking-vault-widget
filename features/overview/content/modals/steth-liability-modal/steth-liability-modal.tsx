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
        data-testid="liabilityStETH-modal-chart"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.utilizationRatio.title}
        amount={utilizationRatio}
        description={liabilityStETH.utilizationRatio.description}
        dataTestId="liabilityStETH-modal-utilizationRatioSection"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.totalStethMintingCapacity.title}
        subTitle={liabilityStETH.totalStethMintingCapacity.subTitle}
        amount={totalMintingCapacityStETH}
        description={liabilityStETH.totalStethMintingCapacity.description}
        dataTestId="liabilityStETH-modal-totalStethMintingCapacitySection"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.stethMintingLimit.title}
        amount={tierLimitStETH}
        description={liabilityStETH.stethMintingLimit.description}
        dataTestId="liabilityStETH-modal-totalStethMintingLimitSection"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.remainingCapacity.title}
        amount={remainingMintingCapacityStETH}
        description={liabilityStETH.remainingCapacity.description}
        dataTestId="liabilityStETH-modal-remainingCapacitySection"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.reserveRatio.title}
        amount={reserveRatio}
        description={liabilityStETH.reserveRatio.description}
        dataTestId="liabilityStETH-modal-reserveRatioSection"
      />
      <SectionDivider />
      <ModalSection
        title={liabilityStETH.forcedRebalanceThreshold.title}
        amount={rebalanceThreshold}
        description={liabilityStETH.forcedRebalanceThreshold.description}
        dataTestId="liabilityStETH-modal-forcedRebalanceThresholdSection"
      />
    </OverviewModal>
  );
};
