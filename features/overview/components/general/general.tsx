import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { AddressSection } from 'features/overview/components/general/address-section';

export const General = () => {
  return (
    <OverviewSection titleContent={<AddressSection />}>
      <OverviewItem title={'Total value'} content={'100.0000 ETH'} />
      <OverviewItem title={'Reserve ratio'} content={'20%'} />
    </OverviewSection>
  );
};
