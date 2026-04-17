import { type FC, useMemo } from 'react';
import { Text, Link } from '@lidofinance/lido-ui';

import { useLidoSDK } from 'modules/web3';
import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';
import { formatDate, isNumber } from 'utils';

import { BEACONCHA_LINK_BY_NETWORK } from 'features/validators/const';

import { LastUpdatedContainer } from './styles';

type LastUpdatedProps = {
  timestamp: number | undefined;
  isLoading: boolean;
};

export const LastUpdated: FC<LastUpdatedProps> = ({ timestamp, isLoading }) => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVault();

  const link = useMemo(() => {
    if (!activeVault?.withdrawalCredentials) {
      return '#';
    }

    const chainId = publicClient.chain.id as 1 | 560048;
    return `${BEACONCHA_LINK_BY_NETWORK[chainId]}/validators/deposits?q=${activeVault.withdrawalCredentials}`;
  }, [publicClient.chain.id, activeVault]);

  return (
    <LastUpdatedContainer>
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
