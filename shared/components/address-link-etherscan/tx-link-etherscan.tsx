import type { Address } from 'viem';
import { Link } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useDappStatus } from 'modules/web3';
import { getEtherscanAddressLink } from 'utils/etherscan';

type AddressLinkEtherscanProps = {
  text?: string;
  address?: Address;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  dataTestId?: string;
};

export const AddressLinkEtherscan = (props: AddressLinkEtherscanProps) => {
  const { address, text = 'View on Etherscan', onClick, dataTestId } = props;
  const { walletChainId } = useDappStatus();

  if (!address) return null;

  return (
    <Link
      onClick={onClick}
      href={getEtherscanAddressLink(
        walletChainId ?? config.defaultChain,
        address,
      )}
      data-testid={dataTestId ? `${dataTestId}-etherScanLink` : null}
    >
      {text}
    </Link>
  );
};
