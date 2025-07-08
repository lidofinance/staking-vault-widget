import {
  Text,
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import { useVaultOverview } from 'features/overview/contexts';
import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { useWithdrawChart } from 'features/overview/hooks';

import { ChartContainer, ChartHeading, List, ListItem } from './styles';

export const ImmediateWithdrawalModal = () => {
  const {
    isLoadingVault,
    values: {
      totalValue,
      balanceEth,
      withdrawableEth,
      collateral,
      feeObligationEth,
    },
  } = useVaultOverview();
  const { chartData, notWithdrawableEthAmount } = useWithdrawChart();

  return (
    <OverviewModal name="withdrawableEth">
      {!isLoadingVault && chartData && (
        <ChartContainer>
          <ChartHeading>
            <Text size="xxs">Total value:</Text>
            <Text size="xxs" strong>
              {totalValue}
            </Text>
          </ChartHeading>
          <ChartLine
            border={ChartLineBorderType.rounded}
            thresholdType={ChartLineThresholdType.dash}
            data={chartData}
            height={24}
            showLabels
          />
          <List>
            <ListItem color="withdrawable">
              <Text size="xxs" color="secondary">
                Available for Immediate Withdrawal
              </Text>
              <Text size="xxs" strong>
                {withdrawableEth}
              </Text>
            </ListItem>
            <ListItem color="notWithdrawable">
              <Text size="xxs" color="secondary">
                Not withdrawable
              </Text>
              <Text size="xxs" strong>
                {notWithdrawableEthAmount} ETH
              </Text>
            </ListItem>
          </List>
        </ChartContainer>
      )}
      <SectionDivider />
      <ModalSection
        title="Total Value"
        amount={totalValue}
        description={
          'The amount of ETH deposited on validators and used for earning rewards.'
        }
      >
        <ModalSection
          title={'Locked by Collateral'}
          titleLeftDecorator={<NewLine />}
          amount={collateral}
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
