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
        title={'Net staking rewards'}
        amount={netStakingRewardsEth}
        description={
          'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.'
        }
      >
        <Formula list={formulasMap.netRewards} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={'Gross staking rewards'}
        amount={grossStakingRewardsEth}
        description={
          'The amount of rewards earned by the validators expressed as a percentage of the volt total value, before fees deductions.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Node Operator Fee'}
        amount={nodeOperatorRewardsEth}
        description={
          'The share of Gross staking rewards that the Node Operator charges for provided validation service.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Lido fees'}
        amount={unsettledLidoFees}
        description={
          'The amount of accumulated but not yet claimed Lido fees. This amount of ETH increases the amount of total locked ETH.'
        }
      />
    </OverviewModal>
  );
};
