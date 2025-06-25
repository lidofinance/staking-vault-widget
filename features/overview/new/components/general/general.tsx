import { InlineLoader } from '@lidofinance/lido-ui';

import { OverviewSection } from 'features/overview/new/shared';
import {
  useVaultOverview,
  SectionData,
} from 'features/overview/contexts/vault-overview';
import { VaultBaseInfo } from './vault-base-info';

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
      {isLoading ? <InlineLoader /> : <VaultBaseInfo />}
    </OverviewSection>
  );
};
