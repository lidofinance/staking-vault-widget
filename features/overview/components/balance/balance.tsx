import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Available to withdraw',
    key: 'withdrawableEth',
  },
  {
    title: 'Idle capital',
    key: 'balanceEth',
  },
  {
    title: 'Deposited to validators',
    key: 'depositedToValidators',
  },
  {
    title: 'Total locked',
    key: 'totalLocked',
  },
  {
    title: 'Locked by accumulated fees',
    key: 'accumulatedFee',
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
        />
      ))}
    </OverviewSection>
  );
};
