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

import { List, ListItem } from './styles';

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

  return (
    <OverviewModal name="healthFactorNumber">
      <ModalSection dataTestId="healthFactorNumber-modal-chartSection">
        <ChartProportion
          loading={isLoadingVault}
          height={24}
          border={ChartProportionBorderType.rounded}
          margin={MarginSize.md}
          borderSize={ChartProportionBorderSize.md}
          data={chartData}
          showLabels
          data-testid="healthFactorNumber-modal-chart"
        />
        <List data-testid="healthFactorNumber-modal-chartLabelsList">
          <ListItem color="rebalance">Forced rebalance</ListItem>
          <ListItem color="danger">At risk</ListItem>
          <ListItem color="warning">Needs attention</ListItem>
          <ListItem color="success">Healthy</ListItem>
        </List>
      </ModalSection>
      <ModalSection
        description={health.rebalanceThreshold.description}
        dataTestId="healthFactorNumber-modal-rebalanceThresholdSection"
      />
      <SectionDivider />
      <ModalSection
        title={health.carrySpread.title}
        amount={carrySpreadApr}
        description={health.carrySpread.description}
        dataTestId="healthFactorNumber-modal-carrySpreadSection"
      >
        <Formula
          list={formulasMap.carrySpread}
          dataTestId="healthFactorNumber-modal-carrySpreadSection-formula"
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.bottomLine.title}
        amount={bottomLineEth}
        description={health.bottomLine.description}
        dataTestId="healthFactorNumber-modal-bottomLineSection"
      >
        <Formula
          list={formulasMap.bottomLine}
          dataTestId="healthFactorNumber-modal-bottomLineSection-formula"
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.netStakingRewards.title}
        amount={netStakingRewardsEth}
        description={health.netStakingRewards.description}
        dataTestId="healthFactorNumber-modal-netStakingRewardsSection"
      />
      <SectionDivider />
      <ModalSection
        title={health.stethRebase.title}
        amount={rebaseRewardEth}
        description={health.stethRebase.description}
        dataTestId="healthFactorNumber-modal-stethRebaseSection"
      />
    </OverviewModal>
  );
};
