import { OverviewItem, OverviewSection } from 'features/overview/new/shared';
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

export const StakingMetrics = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection>
      {sectionPayloadList.map((item) => {
        const { key, ...rest } = getVaultDataToRender(item);
        return <OverviewItem key={key} {...rest} />;
      })}
    </OverviewSection>
  );
};
