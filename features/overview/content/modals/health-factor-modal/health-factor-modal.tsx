import {
  ChartProportion,
  ChartProportionBorderSize,
  ChartProportionBorderType,
  MarginSize,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import {
  Formula,
  ModalSection,
  OverviewModal,
  SectionDivider,
  useHealthChart,
  type FormulaItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { HealthFactorHint, List, ListItem } from './styles';

const formulasMap: Record<'carrySpread' | 'bottomLine', FormulaItem[]> = {
  carrySpread: [
    {
      label: 'Carry Spread',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'stVault bottom line',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '/',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Total Value',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: '365 days',
      type: 'variable',
      hasHighlight: false,
    },
  ],
  bottomLine: [
    {
      label: 'stVault bottom line',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Net staking rewards',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '-',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'stETH rebase',
      type: 'variable',
      hasHighlight: true,
    },
  ],
};

const { health } = vaultTexts.metrics.modals;

type HealthColor = 'rebalance' | 'danger' | 'warning' | 'success';

const colorTextsMap: Record<HealthColor, string> = {
  rebalance: 'Forced rebalance',
  danger: 'At risk',
  warning: 'Needs attention',
  success: 'Healthy',
};

const getHealthColor = (
  healthFactorNumber: number | undefined,
): [HealthColor, string] => {
  if (typeof healthFactorNumber === 'undefined') {
    return ['success', ''];
  }

  let color: HealthColor;

  if (healthFactorNumber <= 100) {
    color = 'rebalance';
  } else if (healthFactorNumber <= 105) {
    color = 'danger';
  } else if (healthFactorNumber <= 125) {
    color = 'warning';
  } else {
    color = 'success';
  }

  return [color, colorTextsMap[color]];
};

const dataTestIdPrefix = 'healthFactorNumber-modal';

export const HealthFactorModal = () => {
  const { isLoadingVault, values } = useVaultOverview();

  const {
    carrySpreadApr,
    bottomLineEth,
    netStakingRewardsEth,
    rebaseRewardEth,
    healthFactorNumber,
  } = values || {};

  const { chartData } = useHealthChart(healthFactorNumber);
  const [colorName, hint] = getHealthColor(healthFactorNumber);

  return (
    <OverviewModal
      name="healthFactorNumber"
      amountRightDecorator={
        <HealthFactorHint color={colorName}>{hint}</HealthFactorHint>
      }
    >
      <ModalSection dataTestId={`${dataTestIdPrefix}-chartSection`}>
        <ChartProportion
          loading={isLoadingVault}
          height={24}
          border={ChartProportionBorderType.rounded}
          margin={MarginSize.md}
          borderSize={ChartProportionBorderSize.md}
          data={chartData}
          showLabels
          data-testid={`${dataTestIdPrefix}-chart`}
        />
        <List data-testid={`${dataTestIdPrefix}-chartLabelsList`}>
          <ListItem color="rebalance">Forced rebalance</ListItem>
          <ListItem color="danger">At risk</ListItem>
          <ListItem color="warning">Needs attention</ListItem>
          <ListItem color="success">Healthy</ListItem>
        </List>
      </ModalSection>
      <ModalSection
        description={health.rebalanceThreshold.description}
        dataTestId={`${dataTestIdPrefix}-rebalanceThresholdSection`}
      />
      <SectionDivider />
      <ModalSection
        title={health.carrySpread.title}
        amount={carrySpreadApr}
        description={health.carrySpread.description}
        dataTestId={`${dataTestIdPrefix}-carrySpreadSection`}
      >
        <Formula
          list={formulasMap.carrySpread}
          dataTestId={`${dataTestIdPrefix}-carrySpreadSection-formula`}
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.bottomLine.title}
        amount={bottomLineEth}
        description={health.bottomLine.description}
        dataTestId={`${dataTestIdPrefix}-bottomLineSection`}
      >
        <Formula
          list={formulasMap.bottomLine}
          dataTestId={`${dataTestIdPrefix}-bottomLineSection-formula`}
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.netStakingRewards.title}
        amount={netStakingRewardsEth}
        description={health.netStakingRewards.description}
        dataTestId={`${dataTestIdPrefix}-netStakingRewardsSection`}
      />
      <SectionDivider />
      <ModalSection
        title={health.stethRebase.title}
        amount={rebaseRewardEth}
        description={health.stethRebase.description}
        dataTestId={`${dataTestIdPrefix}-stethRebaseSection`}
      />
    </OverviewModal>
  );
};
