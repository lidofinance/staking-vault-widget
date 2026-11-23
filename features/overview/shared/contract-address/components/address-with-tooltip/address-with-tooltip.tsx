import type { FC } from 'react';

import { TooltipStyled, AddressStyled } from './styles';

type AddressWithTooltipProps = {
  address: string;
};

export const AddressWithTooltip: FC<AddressWithTooltipProps> = ({
  address,
}) => {
  return (
    <TooltipStyled title={address}>
      <AddressStyled symbols={9} address={address} />
    </TooltipStyled>
  );
};
