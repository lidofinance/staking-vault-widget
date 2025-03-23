import type { Address } from 'viem';
import { Link } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useDappStatus } from 'modules/web3';
import { getEtherscanAddressLink } from 'utils/etherscan';

type AddressLinkEtherscanProps = {
  text?: string;
  address?: Address;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const AddressLinkEtherscan = (props: AddressLinkEtherscanProps) => {
  const { address, text = 'View on Etherscan', onClick } = props;
  const { walletChainId } = useDappStatus();

  if (!address) return null;

  // This component is used in TransactionModal, which is wrapped by SupportL1Chains,
  // but not wrapped by SupportL2Chains (the chainId will never be a L2 network).
  // This is currently the fastest solution.
  return (
    <Link
      onClick={onClick}
      href={getEtherscanAddressLink(
        walletChainId ?? config.defaultChain,
        address,
      )}
    >
      {text}
    </Link>
  );
};
