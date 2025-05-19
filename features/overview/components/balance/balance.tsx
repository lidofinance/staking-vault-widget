import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { appPaths } from 'consts/routing';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Available to withdraw',
    key: 'withdrawableEth',
    actionText: 'Withdraw ETH',
    actionRole: 'withdrawer',
    actionLink: (vault) => appPaths.vaults.vault(vault).eth('withdraw'),
  },
  {
    title: 'Idle capital',
    key: 'balanceEth',
    actionText: 'Supply ETH',
    actionRole: 'supplier',
    actionLink: (vault) => appPaths.vaults.vault(vault).eth('supply'),
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
        <OverviewItem {...item} key={item.key} content={item.payload} />
      ))}
    </OverviewSection>
  );
};
