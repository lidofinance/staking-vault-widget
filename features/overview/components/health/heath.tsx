import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Health factor',
    key: 'healthFactor',
  },
  {
    title: 'Total value',
    key: 'totalValue',
  },
  {
    title: 'stETH liability',
    key: 'liabilityStETH',
  },
  {
    title: 'Forced rebalance threshold',
    key: 'rebalanceThreshold',
  },
];

const getHealthFactorColor = (healthFactor: string) => {
  if (!healthFactor) return '';
  const healthFactorNumber = Number(healthFactor.split('%')[0]);
  if (healthFactorNumber >= 125) return '#53BA95 ';
  if (healthFactorNumber >= 105) return '#ffbf00';
  if (healthFactorNumber >= 100) return '#E14D4D';
  return 'darkRed';
};

export const Health = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="Vault health" titleTooltip="Lorem Ipsum">
      {renderData.map((item) => {
        const isHealthy = item.key === 'healthFactor';
        const color = isHealthy
          ? getHealthFactorColor(item.payload)
          : undefined;

        return (
          <OverviewItem
            key={item.title}
            title={item.title}
            content={item.payload}
            isLoading={item.isLoading}
            color={color}
          />
        );
      })}
    </OverviewSection>
  );
};
