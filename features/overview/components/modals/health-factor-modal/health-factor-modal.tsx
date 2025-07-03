import {
  Formula,
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { FormulaItem } from 'features/overview/types';
import { useVaultOverview } from '../../../contexts';

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

export const HealthFactorModal = () => {
  const {
    values: {
      carrySpreadApr,
      bottomLineEth,
      netStakingRewardsEth,
      rebaseRewardEth,
    },
  } = useVaultOverview();

  return (
    <OverviewModal name="healthFactorNumber">
      <ModalSection
        description={
          'The Health factor value equal to 100% is defined by the Forced rebalance threshold meaning that on the Health factor falling under 100% the vault becomes subject to forced rebalancing.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'Carry Spread'}
        amount={carrySpreadApr}
        description={
          'Estimated yearly returns from staking in the vault, after deductions of fees and stETH Liability growth due to stETH rebase.'
        }
      >
        <Formula list={formulasMap.carrySpread} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={'stVault bottom line'}
        amount={bottomLineEth}
        description={
          'The final amount of rewards earned by the vault owner in the vault perimeter.  Calculated as difference between the Net Staking Rewards and the stETH Liability growth:'
        }
      >
        <Formula list={formulasMap.bottomLine} />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={'Net staking rewards'}
        amount={netStakingRewardsEth}
        description={
          'The amount of staking rewards remain after deductions of Node Operator Fee and Lido fees.'
        }
      />
      <SectionDivider />
      <ModalSection
        title={'stETH Rebase'}
        amount={rebaseRewardEth}
        description={
          'The change of stETH amount happening due to stETH is a rebasing token. Amount for rebase is based o the stETH APR.'
        }
      />
    </OverviewModal>
  );
};
