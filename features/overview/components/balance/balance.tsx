import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Available to withdraw',
    key: 'withdrawableEth',
    actionText: 'Withdraw ETH',
    actionLink: '/supply/withdraw',
  },
  {
    title: 'Idle capital',
    key: 'balanceEth',
    actionText: 'Deposit to validators',
    actionLink: '/supply/fund',
  },
  // TODO: add this after the metrics are implemented
  // {
  //   title: 'Deposited to validators',
  //   key: 'depositedToValidators',
  // },
  {
    title: 'Total locked',
    key: 'totalLocked',
  },
  {
    title: 'Collateral',
    key: 'collateral',
  },
  {
    title: 'Pending unlock',
    key: 'pendingUnlockEth',
  },
];

export const Balance = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="Balance overview">
      {renderData.map((item) => (
        <OverviewItem
          key={item.title}
          title={item.title}
          content={item.payload}
          actionText={item.actionText}
          actionLink={item.actionLink}
          isLoading={item.isLoading}
        />
      ))}
    </OverviewSection>
  );
};
