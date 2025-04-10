import { Text } from '@lidofinance/lido-ui';
import { useVaultInfo } from 'features/overview/contexts';
import { AddressBadge } from 'shared/components';
import { OverviewItem, OverviewSection } from 'features/overview/shared';

export const General = () => {
  const { activeVault } = useVaultInfo();

  const titleContent = (
    <section>
      <div>
        <AddressBadge address={activeVault?.address} />
      </div>
      <div>
        <Text color="secondary" size="xxs">
          Node operator
        </Text>
        <AddressBadge address={activeVault?.address} />
      </div>
    </section>
  );

  return (
    <OverviewSection titleContent={titleContent}>
      <OverviewItem title={'Total value'} content={'100.0000 ETH'} />
      <OverviewItem title={'Reserve ratio'} content={'20%'} />
    </OverviewSection>
  );
};
