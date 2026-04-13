import { type FC, useMemo } from 'react';

import { useLidoSDK } from 'modules/web3';
import { isNumber } from 'utils';
import { ReactComponent as SatelliteNetwork } from 'assets/icons/satellite-network.svg';

import { BEACONCHA_LINK_BY_NETWORK } from 'features/validators/const';

import { LinkStyled } from './styles';

type SatelliteBeaconchaLinkProps = {
  indexOrPubkey: string;
};

export const SatelliteBeaconchaLink: FC<SatelliteBeaconchaLinkProps> = ({
  indexOrPubkey,
}) => {
  const { publicClient } = useLidoSDK();

  const link = useMemo(() => {
    const chainId = publicClient.chain.id as 1 | 560048 | undefined; // only hoodi or mainnet;
    if (!isNumber(chainId)) {
      return '#';
    }

    return `${BEACONCHA_LINK_BY_NETWORK[chainId]}/validator/${indexOrPubkey}`;
  }, [publicClient, indexOrPubkey]);
  return (
    <LinkStyled href={link} target="_blank" rel="noreferrer noopener">
      <SatelliteNetwork />
    </LinkStyled>
  );
};
