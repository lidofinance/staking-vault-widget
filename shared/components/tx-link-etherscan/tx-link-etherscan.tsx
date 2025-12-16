import type { Hash } from 'viem';
import { Link } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useDappStatus } from 'modules/web3';
import { getEtherscanTxLink } from 'utils/etherscan';
import { useShowCallsStatus } from 'wagmi';

type TxLinkEtherscanProps = {
  text?: string;
  txHash?: Hash;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

type TxLinkAAProps = { callId: string };

export const TxLinkAA = ({ callId }: TxLinkAAProps) => {
  const { showCallsStatus, isPending } = useShowCallsStatus();
  return (
    <Link
      onClick={(event) => {
        event.preventDefault();
        if (!isPending) showCallsStatus({ id: callId });
      }}
      aria-disabled={isPending}
    >
      Show transaction in wallet
    </Link>
  );
};

export const TxLinkEtherscan = (props: TxLinkEtherscanProps) => {
  const { txHash, text = 'View on Etherscan', onClick } = props;
  const { walletChainId } = useDappStatus();

  if (!txHash) return null;

  return (
    <Link
      onClick={onClick}
      href={getEtherscanTxLink(walletChainId ?? config.defaultChain, txHash)}
    >
      {text}
    </Link>
  );
};
