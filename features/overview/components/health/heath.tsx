import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { formatPercent, getHealthFactorColor } from 'utils';

const sectionPayloadList: SectionPayload[] = [
  {
    key: 'healthFactorNumber',
  },
  {
    key: 'totalValue',
  },
  {
    key: 'liabilityStETH',
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
