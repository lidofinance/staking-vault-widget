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

const { vaultLiability } = vaultTexts.metrics.modals;

const dataTestIdPrefix = 'vaultLiability-modal';

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
    <OverviewModal name="vaultLiability" symbol="stETH">
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
        title={vaultLiability.utilizationRatio.title}
        amount={utilizationRatio}
        description={vaultLiability.utilizationRatio.description}
        dataTestId={`${dataTestIdPrefix}-utilizationRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.totalStethMintingCapacity.title}
        subTitle={vaultLiability.totalStethMintingCapacity.constrainedBy(
          vaultData?.mintingConstraintBy || 'vault',
        )}
        amount={totalMintingCapacityStETH}
        description={vaultLiability.totalStethMintingCapacity.description}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingCapacitySection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.stethMintingLimit.title}
        amount={tierLimitStETH}
        description={vaultLiability.stethMintingLimit.description}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingLimitSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.remainingCapacity.title}
        amount={remainingMintingCapacityStETH}
        description={vaultLiability.remainingCapacity.description}
        dataTestId={`${dataTestIdPrefix}-remainingCapacitySection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.reserveRatio.title}
        amount={reserveRatio}
        description={vaultLiability.reserveRatio.description}
        dataTestId={`${dataTestIdPrefix}-reserveRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.forcedRebalanceThreshold.title}
        amount={rebalanceThreshold}
        description={vaultLiability.forcedRebalanceThreshold.description}
        dataTestId={`${dataTestIdPrefix}-forcedRebalanceThresholdSection`}
      />
    </OverviewModal>
  );
};
