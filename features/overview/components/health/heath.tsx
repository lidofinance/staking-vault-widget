import { OverviewItem, OverviewSection } from 'features/overview/shared';

export const Health = () => {
  return (
    <OverviewSection title="Vault health" titleTooltip="Lorem Ipsum">
      <OverviewItem title={'Health factor'} content={'143%'} isSuccess />
      <OverviewItem title={'Total value'} content={'100.0000 ETH'} />
      <OverviewItem title={'stETH liability'} content={'65.0000 stETH'} />
      <OverviewItem title={'Forced rebalance threshold'} content={'10%'} />
    </OverviewSection>
  );
};
