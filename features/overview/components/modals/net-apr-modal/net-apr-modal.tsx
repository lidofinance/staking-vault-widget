import { vaultTexts } from 'modules/vaults';

import {
  Formula,
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/contexts';
import { FormulaItem } from 'features/overview/types';

const formulasMap: Record<'netApr' | 'netRewards', FormulaItem[]> = {
  netApr: [
    {
      label: 'Net staking APR',
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
  netRewards: [
    {
      label: 'Net staking rewards',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Gross staking rewards',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '-',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Node operator fee',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '-',
      type: 'operation',
      hasHighlight: false,
    },

    {
      label: 'Lido fees',
      type: 'variable',
      hasHighlight: true,
    },
  ],
};

const { netApr } = vaultTexts.metrics.modals;

export const NetAprModal = () => {
  const {
    values: {
      netStakingRewardsEth,
      grossStakingRewardsEth,
      nodeOperatorRewardsEth,
      unsettledLidoFees,
    },
  } = useVaultOverview();
  return (
    <OverviewModal name="netApr">
      <Formula list={formulasMap.netApr} />
      <SectionDivider />
      <ModalSection
        title={netApr.netStakingRewards.title}
        amount={netStakingRewardsEth}
        description={netApr.netStakingRewards.description}
      >
        <Formula list={formulasMap.netRewards} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={netApr.grossStakingRewards.title}
        amount={grossStakingRewardsEth}
        description={netApr.grossStakingRewards.description}
      />
      <SectionDivider />
      <ModalSection
        title={netApr.noFee.title}
        amount={nodeOperatorRewardsEth}
        description={netApr.noFee.description}
      />
      <SectionDivider />
      <ModalSection
        title={netApr.lidoFees.title}
        amount={unsettledLidoFees}
        description={netApr.lidoFees.description}
      />
    </OverviewModal>
  );
};
