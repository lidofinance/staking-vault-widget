import {
  Text,
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import { useVaultOverview } from 'features/overview/contexts';
import {
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/shared';
import { useWithdrawChart } from 'features/overview/hooks';

import { ChartContainer, ChartHeading, List, ListItem } from './styles';

const { withdrawal } = vaultTexts.metrics.modals;

export const ImmediateWithdrawalModal = () => {
  const {
    isLoadingVault,
    values: {
      totalValueETH,
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
              {totalValueETH}
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
        title={withdrawal.totalValue.title}
        amount={totalValueETH}
        description={withdrawal.totalValue.description}
      >
        <ModalSection
          title="Locked by Collateral"
          titleLeftDecorator={<NewLine />}
          amount={collateral}
        />
        <ModalSection
          title="Fee obligations"
          titleLeftDecorator={<NewLine />}
          amount={feeObligationEth}
        />
        <ModalSection
          title="Withdrawable part of Total Value"
          titleLeftDecorator={<NewLine />}
          amount={withdrawableEth}
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection title="Not staked stVault Balance" amount={balanceEth} />
      <SectionDivider />
      <ModalSection
        title={withdrawal.availableForWithdrawal.title}
        amount={withdrawableEth}
        description={withdrawal.availableForWithdrawal.description}
      />
    </OverviewModal>
  );
};
