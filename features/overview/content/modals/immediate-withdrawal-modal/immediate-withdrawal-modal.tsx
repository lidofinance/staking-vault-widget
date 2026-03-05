import {
  Text,
  ChartLine,
  ChartLineBorderType,
  ChartLineThresholdType,
} from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { FormatToken } from 'shared/formatters';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import {
  useWithdrawChart,
  ModalSection,
  OverviewModal,
  SectionDivider,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';
import { SlashingInfo } from 'features/overview/shared';

import {
  ChartContainer,
  ChartHeading,
  ExtendedInfo,
  List,
  ListItem,
} from './styles';
import { PendingUnlock } from './pending-unlock';
import { MinimalReserveLock } from './minimal-reserve-lock';

const { withdrawal } = vaultTexts.metrics.modals;

const dataTestIdPrefix = 'withdrawableEther-modal';

export const ImmediateWithdrawalModal = () => {
  const { isLoadingVault, values } = useVaultOverview();
  const {
    totalValue,
    collateral,
    feeObligation,
    withdrawableEther,
    balance,
    pendingUnlock,
    minimalReserve,
    stagedBalanceWei,
    isSlashingHappened,
    mintingConstraintBy,
    isReportFresh,
  } = values || {};
  const { chartData, notWithdrawableAmount } = useWithdrawChart();

  return (
    <OverviewModal name="withdrawableEther" symbol="ETH">
      {!isLoadingVault && chartData && (
        <ChartContainer data-testid={`${dataTestIdPrefix}-chartContainer`}>
          <ChartHeading data-testid={`${dataTestIdPrefix}-chartHeading`}>
            <Text size="xxs">Total value:</Text>
            <Text size="xxs" strong>
              <FormatToken
                amount={totalValue}
                maxDecimalDigits={8}
                symbol="ETH"
              />
            </Text>
          </ChartHeading>
          <ChartLine
            border={ChartLineBorderType.rounded}
            thresholdType={ChartLineThresholdType.dash}
            data={chartData}
            height={24}
            showLabels
            data-testid={`${dataTestIdPrefix}-chart`}
          />
          <List data-testid={`${dataTestIdPrefix}-chartLabelsList`}>
            <ListItem color="withdrawable">
              <Text size="xxs" color="secondary">
                Available for Immediate Withdrawal
              </Text>
              <Text size="xxs" strong>
                <FormatToken
                  amount={withdrawableEther}
                  maxDecimalDigits={4}
                  symbol="ETH"
                />
              </Text>
            </ListItem>
            <ListItem color="notWithdrawable">
              <Text size="xxs" color="secondary">
                Not withdrawable
              </Text>
              <Text size="xxs" strong>
                <FormatToken
                  amount={notWithdrawableAmount}
                  maxDecimalDigits={4}
                  symbol="ETH"
                />
              </Text>
            </ListItem>
          </List>
        </ChartContainer>
      )}
      <SectionDivider />
      <ModalSection
        title={withdrawal.totalValue.title}
        amountValue={totalValue}
        amountType="token"
        amountSymbol="ETH"
        dataTestId={`${dataTestIdPrefix}-totalValueSection`}
      >
        <ExtendedInfo>
          <ModalSection
            title="Locked as Collateral"
            titleLeftDecorator={<NewLine />}
            amountValue={collateral}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-totalValueSection-lockedByCollateralSubsection`}
          >
            {!!pendingUnlock && isReportFresh && (
              <PendingUnlock amount={pendingUnlock} />
            )}
            {!!minimalReserve && mintingConstraintBy === 'minimalReserve' && (
              <MinimalReserveLock amount={minimalReserve} />
            )}
            {!!minimalReserve && isSlashingHappened && (
              <SlashingInfo amount={minimalReserve} />
            )}
          </ModalSection>
          <ModalSection
            title="Total fee obligations"
            titleLeftDecorator={<NewLine />}
            amountValue={feeObligation}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-totalValueSection-feeObligationsSubsection`}
          />
          {!!stagedBalanceWei && (
            <ModalSection
              title="Staged as Activation Deposit"
              titleLeftDecorator={<NewLine />}
              amountValue={stagedBalanceWei}
              amountType="token"
              amountSymbol="ETH"
              dataTestId={`${dataTestIdPrefix}-totalValueSection-stagedBalanceWeiSubsection`}
            />
          )}
          <ModalSection
            title="Withdrawable part of Total Value"
            titleLeftDecorator={<NewLine />}
            amountValue={withdrawableEther}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-totalValueSection-withdrawablePartSubsection`}
          />
        </ExtendedInfo>
      </ModalSection>
      <SectionDivider />
      <ModalSection
        title="Unstaked stVault balance"
        amountValue={balance}
        amountType="token"
        amountSymbol="ETH"
        dataTestId={`${dataTestIdPrefix}-notStakedStVaultBalanceSection`}
      />
      <SectionDivider />
      <ModalSection
        title={withdrawal.availableForWithdrawal.title}
        amountValue={withdrawableEther}
        amountType="token"
        amountSymbol="ETH"
        description={withdrawal.availableForWithdrawal.description}
        dataTestId={`${dataTestIdPrefix}-availableForWithdrawalSection`}
      />
    </OverviewModal>
  );
};
