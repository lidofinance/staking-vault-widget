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
} from 'features/overview/shared';
import { FormulaItem } from 'features/overview/types';
import { useVaultOverview } from 'features/overview/contexts';
import { useHealthChart } from 'features/overview/hooks';

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
  const {
    isLoadingVault,
    values: {
      carrySpreadApr,
      bottomLineEth,
      netStakingRewardsEth,
      rebaseRewardEth,
      healthFactorNumber,
    },
  } = useVaultOverview();
  const { chartData } = useHealthChart(healthFactorNumber);

  return (
    <OverviewModal name="healthFactorNumber">
      <ModalSection>
        <ChartProportion
          loading={isLoadingVault}
          height={24}
          border={ChartProportionBorderType.rounded}
          margin={MarginSize.md}
          borderSize={ChartProportionBorderSize.md}
          data={chartData}
          showLabels
        />
        <List>
          <ListItem color="rebalance">Forced rebalance</ListItem>
          <ListItem color="danger">At risk</ListItem>
          <ListItem color="warning">Needs attention</ListItem>
          <ListItem color="success">Healthy</ListItem>
        </List>
      </ModalSection>
      <ModalSection description={health.rebalanceThreshold.description} />
      <SectionDivider />
      <ModalSection
        title={health.carrySpread.title}
        amount={carrySpreadApr}
        description={health.carrySpread.description}
      >
        <Formula list={formulasMap.carrySpread} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.bottomLine.title}
        amount={bottomLineEth}
        description={health.bottomLine.description}
      >
        <Formula list={formulasMap.bottomLine} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.netStakingRewards.title}
        amount={netStakingRewardsEth}
        description={health.netStakingRewards.description}
      />
      <SectionDivider />
      <ModalSection
        title={health.stethRebase.title}
        amount={rebaseRewardEth}
        description={health.stethRebase.description}
      />
    </OverviewModal>
  );
};
