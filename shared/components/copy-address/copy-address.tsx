import { type FC, useCallback } from 'react';

import { Copy, Tooltip, ToastSuccess } from '@lidofinance/lido-ui';

import { truncateAddress } from 'utils';

import { CopyButton } from './styles';

type CopyAddressProps = {
  address: string;
};

export const CopyAddress: FC<CopyAddressProps> = ({ address }) => {
  const handleCopy = useCallback(() => {
    if (!address) return;
    void navigator.clipboard.writeText(address);
    ToastSuccess(`Address ${truncateAddress({ address })} have been copied`);
  }, [address]);

  return (
    <CopyButton onClick={handleCopy}>
      <Tooltip title="Copy address">
        <Copy fill="var(--lido-color-primary)" />
      </Tooltip>
    </CopyButton>
  );
};
