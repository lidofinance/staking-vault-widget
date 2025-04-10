import { OverviewItem, OverviewSection } from 'features/overview/shared';

export const Capacity = () => {
  return (
    <OverviewSection title="stETH capacity utilization">
      <OverviewItem title={'Utilization ratio'} content={'81.25%'} isSuccess />
      <OverviewItem title={'stETH liability'} content={'65.0000 stETH'} />
      <OverviewItem
        title={'Total  minting capacity'}
        content={'80.0000 stETH'}
      />
    </OverviewSection>
  );
};
