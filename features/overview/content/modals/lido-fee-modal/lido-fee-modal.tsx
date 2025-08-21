import { Formula, OverviewModal } from 'features/overview/shared';
import { FormulaItem } from 'features/overview/types';
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

export const LidoFeeModal = () => {
  const { values } = useVaultOverview();

  return (
    <OverviewModal name="unsettledLidoFees">
      {values?.vaultData.infraFeeBP && <Formula list={formulasMap.infraFee} />}
      {values?.vaultData.liquidityFeeBP && (
        <Formula list={formulasMap.liquidityFee} />
      )}
      {values?.vaultData.reservationFeeBP && (
        <Formula list={formulasMap.annualReservationFee} />
      )}
    </OverviewModal>
  );
};
