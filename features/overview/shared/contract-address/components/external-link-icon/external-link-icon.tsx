import { type FC, useMemo } from 'react';
import { External, Tooltip } from '@lidofinance/lido-ui';

import { getEtherscanAddressLink } from 'utils/etherscan';
import { config } from 'config';

import { LinkWrapper } from './styles';

type ExternalLinkIconProps = {
  address: string;
};

export const ExternalLinkIcon: FC<ExternalLinkIconProps> = ({ address }) => {
  const linkToAddress = useMemo(
    () => getEtherscanAddressLink(config.defaultChain, address ?? ''),
    [address],
  );

  return (
    <LinkWrapper target="_blank" href={linkToAddress}>
      <Tooltip title="View on Etherscan">
        <External fill="var(--lido-color-primary)" />
      </Tooltip>
    </LinkWrapper>
  );
};
