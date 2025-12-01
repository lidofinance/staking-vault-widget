import {
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { WEI_PER_ETHER } from 'consts/tx';

import {
  ModalSection,
  OverviewModal,
  useStEthChart,
  useVaultOverviewData,
  SectionDivider,
} from 'features/overview/inner';
import { SlashingInfo } from 'features/overview/shared';

const { vaultLiability } = vaultTexts.metrics.modals;

const dataTestIdPrefix = 'vaultLiability-modal';

export const StethLiabilityModal = () => {
  const chartData = useStEthChart();
  const { isLoading, data: values } = useVaultOverviewData();

  const {
    utilizationRatio,
    totalMintingCapacity,
    mintableStETH,
    reserveRatio,
    rebalanceThreshold,
    tierStETHLimit,
    mintingConstraintBy,
    minimalReserve,
  } = values || {};

  return (
    <OverviewModal name="vaultLiability" symbol="stETH">
      <ChartLine
        loading={isLoading}
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
        amountValue={utilizationRatio}
        amountType="percent"
        description={vaultLiability.utilizationRatio.description}
        dataTestId={`${dataTestIdPrefix}-utilizationRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.totalStethMintingCapacity.title}
        subTitle={vaultLiability.totalStethMintingCapacity.constrainedBy(
          mintingConstraintBy ?? 'vault',
        )}
        amountValue={totalMintingCapacity}
        amountType="token"
        description={vaultLiability.totalStethMintingCapacity.description(
          minimalReserve,
          mintingConstraintBy,
        )}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingCapacitySection`}
      >
        {!!minimalReserve && minimalReserve > WEI_PER_ETHER && (
          <SlashingInfo amount={minimalReserve} />
        )}
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={vaultLiability.stethMintingLimit.title}
        amountValue={tierStETHLimit}
        amountType="token"
        description={vaultLiability.stethMintingLimit.description}
        dataTestId={`${dataTestIdPrefix}-totalStethMintingLimitSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.remainingCapacity.title}
        amountValue={mintableStETH}
        amountType="token"
        description={vaultLiability.remainingCapacity.description}
        dataTestId={`${dataTestIdPrefix}-remainingCapacitySection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.reserveRatio.title}
        amountValue={reserveRatio}
        amountType="percent"
        description={vaultLiability.reserveRatio.description}
        dataTestId={`${dataTestIdPrefix}-reserveRatioSection`}
      />
      <SectionDivider />
      <ModalSection
        title={vaultLiability.forcedRebalanceThreshold.title}
        amountValue={rebalanceThreshold}
        amountType="percent"
        description={vaultLiability.forcedRebalanceThreshold.description}
        dataTestId={`${dataTestIdPrefix}-forcedRebalanceThresholdSection`}
      />
    </OverviewModal>
  );
};
