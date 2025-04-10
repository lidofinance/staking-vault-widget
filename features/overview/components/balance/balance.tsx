import { OverviewItem, OverviewSection } from 'features/overview/shared';

export const Balance = () => {
  return (
    <OverviewSection title="Balance overview">
      <OverviewItem title={'Available to withdraw'} content={'18.7500 ETH'} />
      <OverviewItem title={'Idle capital'} content={'40.0000 ETH'} />
      <OverviewItem title={'Deposited to validators'} content={'60.0000 ETH'} />
      <OverviewItem title={'Total locked'} content={'81.6417 ETH'} />
      <OverviewItem
        title={'Locked by accumulated fees:'}
        content={'7.1593 ETH'}
      />
      <OverviewItem title={'Collateral'} content={'72.2500 ETH'} />
      <OverviewItem title={'Pending unlock'} content={'15.7469 ETH'} />
    </OverviewSection>
  );
};
