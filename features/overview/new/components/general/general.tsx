import { OverviewSection } from 'features/overview/new/shared';
import {
  useVaultOverview,
  SectionData,
} from 'features/overview/contexts/vault-overview';
import { VaultBaseInfo } from './vault-base-info';

import { GeneralLoader } from './styles';

const sectionPayloadList: SectionData[] = [
  {
    key: 'address',
  },
  {
    key: 'nodeOperator',
  },
  {
    key: 'nodeOperatorFeeRate',
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
