import { useVaultValidatorsMeta, vaultTexts } from 'modules/vaults';
import { Hint } from 'shared/components';

import { ReactComponent as NewLine } from 'assets/icons/new-line.svg';
import {
  ModalSection,
  NestedSections,
  OffBookHint,
  OverviewModal,
  ReportUpdatedAt,
  SectionDivider,
} from 'features/overview/shared';

const { modals } = vaultTexts.metrics;
const { notStakedBalance, pendingDepositsDelay } = modals;

const dataTestIdPrefix = 'balance-modal';

export const VaultBalanceModal = () => {
  const { meta } = useVaultValidatorsMeta();

  const pdgBalance = meta?.pdgBalance;
  const offBookBalance = meta?.offBookBalance;
  const pendingDeposits =
    pdgBalance === undefined || offBookBalance === undefined
      ? undefined
      : pdgBalance + offBookBalance;

  return (
    <OverviewModal
      name="balance"
      symbol="ETH"
      amountRightDecorator={<ReportUpdatedAt />}
    >
      <SectionDivider />
      <ModalSection
        title={notStakedBalance.stakedOnValidators.title}
        amountValue={meta?.totalBalance}
        amountType="token"
        amountSymbol="ETH"
        dataTestId={`${dataTestIdPrefix}-stakedOnValidatorsSection`}
      />
      <SectionDivider />
      <ModalSection
        title={notStakedBalance.pendingDeposits.title}
        amountValue={pendingDeposits}
        amountType="token"
        amountSymbol="ETH"
        description={pendingDepositsDelay}
        compactDescription
        dataTestId={`${dataTestIdPrefix}-pendingDepositsSection`}
      >
        <NestedSections>
          <ModalSection
            title={notStakedBalance.pdgDeposits.title}
            titleLeftDecorator={<NewLine />}
            amountValue={pdgBalance}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-pdgDepositsSubsection`}
          />
          <ModalSection
            title={notStakedBalance.offBookDeposits.title}
            titleLeftDecorator={<NewLine />}
            titleRightDecorator={<Hint text={<OffBookHint />} />}
            amountValue={offBookBalance}
            amountType="token"
            amountSymbol="ETH"
            dataTestId={`${dataTestIdPrefix}-offBookDepositsSubsection`}
          />
        </NestedSections>
      </ModalSection>
    </OverviewModal>
  );
};
