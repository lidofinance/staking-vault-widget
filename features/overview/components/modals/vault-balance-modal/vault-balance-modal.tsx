import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';

export const VaultBalanceModal = () => {
  // TODO: get info about already staked eth
  return (
    <OverviewModal name="balanceEth">
      <SectionDivider />
      <ModalSection
        title={'Staked'}
        amount={'98.8115 ETH'}
        description={
          'The amount of ETH deposited on validators and used for earning rewards.'
        }
      />
    </OverviewModal>
  );
};
