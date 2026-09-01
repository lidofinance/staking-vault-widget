import { useVaultValidatorsMeta, vaultTexts } from 'modules/vaults';
import { Hint } from 'shared/components';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import {
  ModalSection,
  NestedSections,
  OverviewModal,
  ReportUpdatedAt,
  SectionDivider,
  OffBookHint,
} from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';

const { modals, totalValueETH } = vaultTexts.metrics;
const { totalValue, pendingDepositsDelay } = modals;

const dataTestIdPrefix = 'totalValueETH-modal';

export const TotalValueModal = () => {
  const { values } = useVaultOverview();
  const { meta } = useVaultValidatorsMeta();

  const totalValueETHAmount = values?.totalValueETH ?? 0n;
  const offBookBalance = meta?.offBookBalance ?? 0n;
  const hasOffBookDeposits = offBookBalance > 0n;

  return (
    <OverviewModal
      name="totalValueETH"
      symbol="ETH"
      amountRightDecorator={<ReportUpdatedAt />}
      description={
        hasOffBookDeposits
          ? `${totalValueETH.hint} ${totalValue.excludingOffBook}`
          : undefined
      }
    >
      <SectionDivider />
      {hasOffBookDeposits && (
        <>
          <ModalSection
            title={totalValue.grossTotalSupplied.title}
            amountValue={totalValueETHAmount + offBookBalance}
            amountType="token"
            amountSymbol="ETH"
            description={totalValue.grossTotalSupplied.description}
            dataTestId={`${dataTestIdPrefix}-grossTotalSuppliedSection`}
          />
          <SectionDivider />
        </>
      )}
      <ModalSection
        title={totalValue.totalValue.title}
        amountValue={values?.totalValueETH}
        amountType="token"
        amountSymbol="ETH"
        dataTestId={`${dataTestIdPrefix}-totalValueSection`}
      >
        <NestedSections>
          <ModalSection
            title={totalValue.notStakedBalance.title}
            titleLeftDecorator={<NewLine />}
            amountValue={values?.balance}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-notStakedBalanceSubsection`}
          />
          <ModalSection
            title={totalValue.stakedOnValidators.title}
            titleLeftDecorator={<NewLine />}
            amountValue={meta?.totalBalance}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-stakedOnValidatorsSubsection`}
          />
          <ModalSection
            title={totalValue.pdgDeposits.title}
            titleLeftDecorator={<NewLine />}
            amountValue={meta?.pdgBalance}
            amountType="token"
            amountSymbol="ETH"
            description={pendingDepositsDelay}
            compactDescription
            dataTestId={`${dataTestIdPrefix}-pdgDepositsSubsection`}
          />
        </NestedSections>
      </ModalSection>
      {hasOffBookDeposits && (
        <>
          <SectionDivider />
          <ModalSection
            title={totalValue.offBookDeposits.title}
            titleRightDecorator={<Hint text={<OffBookHint />} />}
            amountValue={offBookBalance}
            amountType="token"
            amountSymbol="ETH"
            description={totalValue.offBookDeposits.description}
            compactDescription
            dataTestId={`${dataTestIdPrefix}-offBookDepositsSection`}
          />
        </>
      )}
    </OverviewModal>
  );
};
