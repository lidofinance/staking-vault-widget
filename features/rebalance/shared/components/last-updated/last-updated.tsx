import { type FC, useMemo } from 'react';
import { Text, Link } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';
import { formatDate, isNumber } from 'utils';
import { config } from 'config';

import { getBeaconchaBaseUrlByChainId } from 'features/validators/utils';

import { LastUpdatedContainer } from './styles';

type LastUpdatedProps = {
  timestamp: number | undefined;
  isLoading: boolean;
};

const { defaultChain: chainId } = config;

export const LastUpdated: FC<LastUpdatedProps> = ({ timestamp, isLoading }) => {
  const { activeVault } = useVault();

  const link = useMemo(() => {
    if (!activeVault?.withdrawalCredentials) {
      return '#';
    }

    const baseUrl = getBeaconchaBaseUrlByChainId(chainId);
    return `${baseUrl}/validators/deposits?q=${activeVault.withdrawalCredentials}`;
  }, [activeVault]);

  return (
    <LastUpdatedContainer data-testid="last-updated">
      <InlineLoader isLoading={isLoading} width={188} height={18}>
        <Text size="xxs" color="secondary">
          Last updated: {isNumber(timestamp) && formatDate(new Date(timestamp))}
        </Text>
      </InlineLoader>
      <InlineLoader isLoading={isLoading} width={212} height={18}>
        <Text size="xxs" color="secondary">
          Actual state available on{' '}
          <Link href={link} rel="noopener noreferrer">
            Beaconcha.in
          </Link>
        </Text>
      </InlineLoader>
    </LastUpdatedContainer>
  );
};
