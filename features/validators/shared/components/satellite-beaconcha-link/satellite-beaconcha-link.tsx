import { type FC, useMemo } from 'react';

import { ReactComponent as SatelliteNetwork } from 'assets/icons/satellite-network.svg';
import { config } from 'config';

import { getBeaconchaBaseUrlByChainId } from 'features/validators/utils';

import { LinkStyled } from './styles';

type SatelliteBeaconchaLinkProps = {
  indexOrPubkey: string;
};

const { defaultChain: chainId } = config;

export const SatelliteBeaconchaLink: FC<SatelliteBeaconchaLinkProps> = ({
  indexOrPubkey,
}) => {
  const link = useMemo(() => {
    return `${getBeaconchaBaseUrlByChainId(chainId)}/validator/${indexOrPubkey}`;
  }, [indexOrPubkey]);

  return (
    <LinkStyled href={link} target="_blank" rel="noreferrer noopener">
      <SatelliteNetwork />
    </LinkStyled>
  );
};
