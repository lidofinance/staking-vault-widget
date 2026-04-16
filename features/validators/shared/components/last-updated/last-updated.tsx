import { type FC, useMemo } from 'react';
import { Text, Link } from '@lidofinance/lido-ui';

import { useLidoSDK } from 'modules/web3';
import { formatDate, isNumber } from 'utils';

import { BEACONCHA_LINK_BY_NETWORK } from 'features/validators/const';

import { LastUpdatedContainer } from './styles';
import { useVault } from '../../../../../modules/vaults';

type LastUpdatedProps = {
  timestamp: number | undefined;
};

export const LastUpdated: FC<LastUpdatedProps> = ({ timestamp }) => {
  const { publicClient } = useLidoSDK();
  const { vaultAddress } = useVault();

  const link = useMemo(() => {
    const chainId = publicClient.chain.id as 1 | 560048;
    return `${BEACONCHA_LINK_BY_NETWORK[chainId]}/address/${vaultAddress}`;
  }, [publicClient.chain.id, vaultAddress]);

  return (
    <LastUpdatedContainer>
      <Text size="xxs" color="secondary">
        Last updated: {isNumber(timestamp) && formatDate(new Date(timestamp))}
      </Text>
      <Text size="xxs" color="secondary">
        Actual state available on{' '}
        <Link href={link} rel="noopener noreferrer">
          Beaconcha.in
        </Link>
      </Text>
    </LastUpdatedContainer>
  );
};
