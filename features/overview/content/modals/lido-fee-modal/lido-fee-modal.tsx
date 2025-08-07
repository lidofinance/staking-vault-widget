import { Formula, OverviewModal } from 'features/overview/shared';
import { FormulaItem } from 'features/overview/types';

const formulasMap: Record<'infraFee' | 'liquidityFee', FormulaItem[]> = {
  infraFee: [
    {
      label: 'Annual Infrastructure fee',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: '0.5%',
      type: 'variable',
      hasHighlight: false,
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Total Value',
      type: 'variable',
      hasHighlight: true,
    },
  ],
  liquidityFee: [
    {
      label: 'Annual Liquidity fee',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: '6%',
      type: 'variable',
      hasHighlight: false,
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'stETH liability',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'stETH APR',
      type: 'variable',
      hasHighlight: true,
    },
  ],
};

const dataTestIdPrefix = 'unsettledLidoFees-modal';

export const LidoFeeModal = () => {
  return (
    <OverviewModal name="unsettledLidoFees">
      <Formula
        list={formulasMap.infraFee}
        dataTestId={`${dataTestIdPrefix}-infraFee-formula`}
      />
      <Formula
        list={formulasMap.liquidityFee}
        dataTestId={`${dataTestIdPrefix}-liquidityFee-formula`}
      />
    </OverviewModal>
  );
};
