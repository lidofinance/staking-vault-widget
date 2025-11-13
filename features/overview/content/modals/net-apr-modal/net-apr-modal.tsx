import { vaultTexts } from 'modules/vaults';

import {
  Formula,
  ModalSection,
  OverviewModal,
  SectionDivider,
  type FormulaItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

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

const dataTestIdPrefix = 'netApr-modal';

export const NetAprModal = () => {
  const { values } = useVaultOverview();

  const {
    netStakingRewards,
    grossStakingRewards,
    nodeOperatorRewards,
    unsettledLidoFees,
  } = values || {};

  return (
    <OverviewModal name="netApr">
      <Formula
        list={formulasMap.netApr}
        dataTestId={`${dataTestIdPrefix}-formula`}
      />
      <SectionDivider />
      <ModalSection
        title={netApr.netStakingRewards.title}
        amountType="token"
        amountValue={netStakingRewards}
        amountSymbol="ETH"
        description={netApr.netStakingRewards.description}
        dataTestId={`${dataTestIdPrefix}-netStakingRewardsSection`}
      >
        <Formula
          list={formulasMap.netRewards}
          dataTestId={`${dataTestIdPrefix}-netStakingRewardsSection-formula`}
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title={netApr.grossStakingRewards.title}
        amountValue={grossStakingRewards}
        amountType="token"
        amountSymbol="ETH"
        description={netApr.grossStakingRewards.description}
        dataTestId={`${dataTestIdPrefix}-grossStakingRewardsSection`}
      />
      <SectionDivider />
      <ModalSection
        title={netApr.noFee.title}
        amountValue={nodeOperatorRewards}
        amountType="token"
        amountSymbol="ETH"
        description={netApr.noFee.description}
        dataTestId={`${dataTestIdPrefix}-noFeeSection`}
      />
      <SectionDivider />
      <ModalSection
        title={netApr.lidoFees.title}
        amountValue={unsettledLidoFees}
        amountType="token"
        amountSymbol="ETH"
        description={netApr.lidoFees.description}
        dataTestId={`${dataTestIdPrefix}-lidoFeesSection`}
      />
    </OverviewModal>
  );
};
