import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/contexts';

export const VaultBalanceModal = () => {
  const {
    values: { staked },
  } = useVaultOverview();

  return (
    <OverviewModal name="balanceEth">
      <SectionDivider />
      <ModalSection
        title={'Staked'}
        amount={staked}
        description={
          'The amount of ETH deposited on validators and used for earning rewards.'
        }
      />
    </OverviewModal>
  );
};
