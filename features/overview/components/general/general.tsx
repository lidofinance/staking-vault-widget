import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { AddressSection } from 'features/overview/components/general/address-section';
import {
  useVaultOverview,
  SectionPayload,
} from 'features/overview/contexts/vault-overview';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Total value',
    key: 'totalValue',
  },
  {
    title: 'Reserve ratio',
    key: 'reserveRatio',
  },
];

export const General = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection titleContent={<AddressSection />}>
      {renderData.map((item) => (
        <OverviewItem {...item} key={item.key} content={item.payload} />
      ))}
    </OverviewSection>
  );
};
