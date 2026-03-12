import {
  ChartProportion,
  ChartProportionBorderSize,
  ChartProportionBorderType,
  MarginSize,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import {
  VAULT_HEALTH_PERCENT_GREEN,
  VAULT_HEALTH_PERCENT_RED,
  VAULT_HEALTH_PERCENT_YELLOW,
} from 'consts/threshold';

import {
  Formula,
  ModalSection,
  OverviewModal,
  SectionDivider,
  useHealthChart,
  type FormulaItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { ChartContainer, HealthFactorHint, List, ListItem } from './styles';

import { SectionContent } from '../styles';

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

  if (healthFactorNumber <= VAULT_HEALTH_PERCENT_RED) {
    color = 'rebalance';
  } else if (healthFactorNumber <= VAULT_HEALTH_PERCENT_YELLOW) {
    color = 'danger';
  } else if (healthFactorNumber <= VAULT_HEALTH_PERCENT_GREEN) {
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
    bottomLine,
    netStakingRewards,
    rebaseReward,
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
      <ChartContainer>
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
      </ChartContainer>
      <ModalSection
        description={health.rebalanceThreshold.description}
        dataTestId={`${dataTestIdPrefix}-rebalanceThresholdSection`}
      />
      <SectionDivider />
      <ModalSection
        title={health.carrySpread.title}
        amountType="percent"
        amountValue={carrySpreadApr}
        description={health.carrySpread.description}
        dataTestId={`${dataTestIdPrefix}-carrySpreadSection`}
      >
        <SectionContent>
          <Formula
            list={formulasMap.carrySpread}
            dataTestId={`${dataTestIdPrefix}-carrySpreadSection-formula`}
          />
        </SectionContent>
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.bottomLine.title}
        amountValue={bottomLine}
        amountType="token"
        amountSymbol="ETH"
        description={health.bottomLine.description}
        dataTestId={`${dataTestIdPrefix}-bottomLineSection`}
      >
        <SectionContent>
          <Formula
            list={formulasMap.bottomLine}
            dataTestId={`${dataTestIdPrefix}-bottomLineSection-formula`}
          />
        </SectionContent>
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={health.netStakingRewards.title}
        amountValue={netStakingRewards}
        amountType="token"
        amountSymbol="ETH"
        description={health.netStakingRewards.description}
        dataTestId={`${dataTestIdPrefix}-netStakingRewardsSection`}
      />
      <SectionDivider />
      <ModalSection
        title={health.stethRebase.title}
        amountValue={rebaseReward}
        amountType="token"
        description={health.stethRebase.description}
        dataTestId={`${dataTestIdPrefix}-stethRebaseSection`}
      />
    </OverviewModal>
  );
};
