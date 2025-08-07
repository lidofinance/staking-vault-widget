import {
  Text,
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import {
  useWithdrawChart,
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { ChartContainer, ChartHeading, List, ListItem } from './styles';

const { withdrawal } = vaultTexts.metrics.modals;

export const ImmediateWithdrawalModal = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const {
    totalValueETH,
    balanceEth,
    withdrawableEth,
    collateral,
    feeObligationEth,
  } = values || {};
  const { chartData, notWithdrawableEthAmount } = useWithdrawChart();

  return (
    <OverviewModal name="withdrawableEth">
      {!isLoadingVault && chartData && (
        <ChartContainer data-testid="withdrawableEth-modal-chartContainer">
          <ChartHeading data-testid="withdrawableEth-modal-chartHeading">
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
            data-testid="withdrawableEth-modal-chart"
          />
          <List data-testid="withdrawableEth-modal-chartLabelsList">
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
        dataTestId="withdrawableEth-modal-totalValueSection"
      >
        <ModalSection
          title="Locked by Collateral"
          titleLeftDecorator={<NewLine />}
          amount={collateral}
          dataTestId="withdrawableEth-modal-totalValueSection-lockedByCollateralSubsection"
        />
        <ModalSection
          title="Fee obligations"
          titleLeftDecorator={<NewLine />}
          amount={feeObligationEth}
          dataTestId="withdrawableEth-modal-totalValueSection-feeObligationsSubsection"
        />
        <ModalSection
          title="Withdrawable part of Total Value"
          titleLeftDecorator={<NewLine />}
          amount={withdrawableEth}
          dataTestId="withdrawableEth-modal-totalValueSection-withdrawablePartSubsection"
        />
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title="Not staked stVault Balance"
        amount={balanceEth}
        dataTestId="withdrawableEth-modal-notStakedStVaultBalanceSection"
      />
      <SectionDivider />
      <ModalSection
        title={withdrawal.availableForWithdrawal.title}
        amount={withdrawableEth}
        description={withdrawal.availableForWithdrawal.description}
        dataTestId="withdrawableEth-modal-availableForWithdrawalSection"
      />
    </OverviewModal>
  );
};
