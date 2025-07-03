import { OverviewSection } from 'features/overview/shared';
import {
  useVaultOverview,
  SectionData,
} from 'features/overview/contexts/vault-overview';
import { VaultBaseInfo } from './vault-base-info';

import { GeneralLoader } from './styles';

const sectionPayloadList: SectionData[] = [
  {
    indicator: 'address',
  },
  {
    indicator: 'nodeOperator',
  },
  {
    indicator: 'nodeOperatorFeeRate',
  },
];

export const General = () => {
  const { getVaultDataToRender } = useVaultOverview();
  const isLoading = sectionPayloadList.some(
    (item) => getVaultDataToRender(item).isLoading,
  );

  return (
    <OverviewSection>
      {isLoading ? <GeneralLoader /> : <VaultBaseInfo />}
    </OverviewSection>
  );
};
