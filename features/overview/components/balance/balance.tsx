import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionData, useVaultOverview } from 'features/overview/contexts';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'balanceEth',
    titleView: 'row',
    textSize: 'lg',
  },
  {
    indicator: 'withdrawableEth',
    titleView: 'row',
    textSize: 'lg',
  },
];

export const Balance = () => {
  const { getVaultDataToRender } = useVaultOverview();

  return (
    <OverviewSection>
      {sectionPayloadList.map((sectionItem) => {
        const dataToRender = getVaultDataToRender(sectionItem);

        return <OverviewItem key={dataToRender.indicator} {...dataToRender} />;
      })}
    </OverviewSection>
  );
};
