import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { AddressSection } from 'features/overview/components/general/address-section';
import {
  useVaultOverview,
  SectionData,
} from 'features/overview/contexts/vault-overview';

const sectionPayloadList: SectionData[] = [
  {
    key: 'totalValue',
  },
  {
    key: 'reserveRatio',
  },
];

export const General = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection titleContent={<AddressSection />}>
      {sectionPayloadList.map((item) => {
        const { key, ...rest } = getVaultDataToRender(item);
        return <OverviewItem key={key} {...rest} />;
      })}
    </OverviewSection>
  );
};
