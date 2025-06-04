import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';
import { appPaths } from 'consts/routing';

const sectionPayloadList: SectionData[] = [
  {
    key: 'withdrawableEth',
    actionRole: 'withdrawer',
    actionLink: (vault) => appPaths.vaults.vault(vault).eth('withdraw'),
  },
  {
    key: 'balanceEth',
    actionRole: 'supplier',
    actionLink: (vault) => appPaths.vaults.vault(vault).eth('supply'),
  },
  // TODO: add this after the metrics are implemented
  // {
  //   title: 'Deposited to validators',
  //   key: 'depositedToValidators',
  // },
  {
    key: 'totalLocked',
  },
  {
    key: 'collateral',
  },
  {
    key: 'pendingUnlockEth',
  },
];

export const Balance = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection title="Balance overview">
      {sectionPayloadList.map((sectionItem) => {
        const { key, ...rest } = getVaultDataToRender(sectionItem);

        return <OverviewItem key={key} {...rest} />;
      })}
    </OverviewSection>
  );
};
