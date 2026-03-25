import type { FC } from 'react';
import { Address } from '@lidofinance/lido-ui';

import { TooltipStyled } from './styles';

type AddressWithTooltipProps = {
  address: string;
};

export const AddressWithTooltip: FC<AddressWithTooltipProps> = ({
  address,
}) => {
  return (
    <TooltipStyled title={address}>
      <Address symbols={9} address={address} />
    </TooltipStyled>
  );
};
