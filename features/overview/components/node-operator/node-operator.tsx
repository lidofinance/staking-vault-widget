import { OverviewItem, OverviewSection } from 'features/overview/shared';
import { SectionPayload, useVaultOverview } from 'features/overview/contexts';
import { appPaths } from 'consts/routing';

const sectionPayloadList: SectionPayload[] = [
  {
    title: 'Reward share',
    key: 'nodeOperatorFee',
  },
  {
    title: 'Accumulated',
    key: 'accumulatedFee',
    actionLink: (vault) => appPaths.vaults.vault(vault).claim,
    actionText: 'Claim',
    actionRole: 'nodeOperatorFeeClaimer',
  },
];

export const NodeOperator = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const renderData = getVaultDataToRender(sectionPayloadList);

  return (
    <OverviewSection title="Node operator reward share">
      {renderData.map((item) => (
        <OverviewItem {...item} key={item.key} content={item.payload} />
      ))}
    </OverviewSection>
  );
};
