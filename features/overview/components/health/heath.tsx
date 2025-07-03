import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';
import { formatPercent, getHealthFactorColor } from 'utils';
import { appPaths } from 'consts/routing';

const sectionPayloadList: SectionData[] = [
  {
    key: 'healthFactorNumber',
  },
  {
    key: 'totalValue',
  },
  {
    key: 'liabilityStETH',
    addStethToWallet: true,
    actionRole: 'minter',
    actionLink: (vaultAddress) =>
      appPaths.vaults.vault(vaultAddress).steth('mint'),
  },
  {
    key: 'rebalanceThreshold',
  },
];

export const Health = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection title="Vault health" titleTooltip="Lorem Ipsum">
      {sectionPayloadList.map((sectionEntry) => {
        const { key, payload, ...item } = getVaultDataToRender(sectionEntry);
        const isHealthFactor = key === 'healthFactorNumber';
        const color = isHealthFactor
          ? getHealthFactorColor(payload)
          : undefined;
        const formattedPayload = isHealthFactor
          ? formatPercent.format(Number(payload) / 100)
          : payload;

        return (
          <OverviewItem
            {...item}
            key={key}
            payload={formattedPayload}
            color={color}
          />
        );
      })}
    </OverviewSection>
  );
};
