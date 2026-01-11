import { Formula, OverviewModal } from 'features/overview/shared';
import type { FormulaItem } from 'features/overview/types';
import { useVaultOverview } from '../../../vault-overview';

const formulasMap: Record<
  'infraFee' | 'liquidityFee' | 'annualReservationFee',
  FormulaItem[]
> = {
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
      vaultIndicator: 'infraFee',
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
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Lido Core APR',
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
      vaultIndicator: 'liquidityFee',
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
      label: 'Lido Core APR',
      type: 'variable',
      hasHighlight: true,
    },
  ],
  annualReservationFee: [
    {
      label: 'Annual Reservation Liquidity fee',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '=',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: '8%',
      type: 'variable',
      hasHighlight: false,
      vaultIndicator: 'reservationFee',
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'stETH minting capacity',
      type: 'variable',
      hasHighlight: true,
    },
    {
      label: '×',
      type: 'operation',
      hasHighlight: false,
    },
    {
      label: 'Lido Core APR',
      type: 'variable',
      hasHighlight: true,
    },
  ],
};

const dataTestIdPrefix = 'unsettledLidoFees-modal';

export const LidoFeeModal = () => {
  const { values } = useVaultOverview();

  return (
    <OverviewModal name="unsettledLidoFees" symbol="ETH">
      {!!values?.vaultData.infraFeeBP && (
        <Formula
          list={formulasMap.infraFee}
          dataTestId={`${dataTestIdPrefix}-infraFee-formula`}
        />
      )}
      {!!values?.vaultData.liquidityFeeBP && (
        <Formula
          list={formulasMap.liquidityFee}
          dataTestId={`${dataTestIdPrefix}-liquidityFee-formula`}
        />
      )}
      {!!values?.vaultData.reservationFeeBP && (
        <Formula
          list={formulasMap.annualReservationFee}
          dataTestId={`${dataTestIdPrefix}-annualReservationFee-formula`}
        />
      )}
    </OverviewModal>
  );
};
