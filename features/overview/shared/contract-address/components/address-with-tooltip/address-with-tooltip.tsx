import type { FC } from 'react';
import { Tooltip, Address } from '@lidofinance/lido-ui';

type AddressWithTooltipProps = {
  address: string;
};

export const AddressWithTooltip: FC<AddressWithTooltipProps> = ({
  address,
}) => {
  return (
    <Tooltip title={address}>
      <Address symbols={9} address={address} />
    </Tooltip>
  );
};
