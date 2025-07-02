import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';
import { getUtilizationRatioColor } from 'utils';
import { appPaths } from 'consts/routing';

const sectionPayloadList: SectionData[] = [
  {
    key: 'utilizationRatio',
  },
  {
    key: 'liabilityStETH',
    addStethToWallet: true,
    actionRole: 'minter',
    actionLink: (vaultAddress) =>
      appPaths.vaults.vault(vaultAddress).steth('mint'),
  },
  {
    key: 'totalMintingCapacityStETH',
    addStethToWallet: true,
  },
];

export const Capacity = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection title="stETH capacity utilization">
      {sectionPayloadList.map((sectionItem) => {
        const { key, ...item } = getVaultDataToRender(sectionItem);
        const isUtilizationRatio = key === 'utilizationRatio';
        const color = isUtilizationRatio
          ? getUtilizationRatioColor(String(item.payload))
          : undefined;

        return <OverviewItem {...item} key={key} color={color} />;
      })}
    </OverviewSection>
  );
};
