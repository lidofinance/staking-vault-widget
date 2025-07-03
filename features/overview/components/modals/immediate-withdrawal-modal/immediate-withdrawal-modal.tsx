import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';

import { useVaultOverview } from 'features/overview/contexts';
import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';

export const ImmediateWithdrawalModal = () => {
  const {
    values: {
      totalValue,
      balanceEth,
      withdrawableEth,
      collateral,
      feeObligationEth,
    },
  } = useVaultOverview();

  return (
    <OverviewModal name="withdrawableEth">
      <SectionDivider />
      <ModalSection
        title={'Total Value'}
        amount={totalValue}
        description={
          'The amount of ETH deposited on validators and used for earning rewards.'
        }
      >
        {/*TODO get repaid ~9.55420 stETH*/}
        <ModalSection
          title={'Locked by Collateral'}
          titleLeftDecorator={<NewLine />}
          amount={collateral}
          description={
            'Corresponding amount of ETH expecting to be unlocked with the upcoming Oracle report based on recently repaid ~9.55420 stETH.'
          }
        />
        <ModalSection
          title={'Fee obligations'}
          titleLeftDecorator={<NewLine />}
          amount={feeObligationEth}
        />
        <ModalSection
          title={'Withdrawable part of Total Value'}
          titleLeftDecorator={<NewLine />}
          amount={withdrawableEth}
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection title={'Not staked stVault Balance'} amount={balanceEth} />
      <SectionDivider />
      <ModalSection
        title={'Available for Immediate Withdrawal'}
        amount={withdrawableEth}
        description={
          'Immediately available to withdraw ETH is limited by Collateral and Obligations, as well as current stVault Balance.'
        }
      />
    </OverviewModal>
  );
};
