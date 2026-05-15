import type { FC } from 'react';

import { FormatToken } from 'shared/formatters';
import { ONE_ETHER } from 'consts/tx';

import { useSettleLidoFees } from 'modules/vaults';

import { ListItem, ListItemContent } from '../styles';
import { ButtonLink } from './styles';
import { TextStyled } from '../../../styles';

type SettleFeesProps = {
  lidoFees: bigint | undefined;
};

export const SettleFees: FC<SettleFeesProps> = ({ lidoFees }) => {
  const { settleLidoFees } = useSettleLidoFees();

  if (!lidoFees || lidoFees < ONE_ETHER) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <TextStyled size="xxs">
          <ButtonLink role="button" onClick={settleLidoFees}>
            Settle <FormatToken amount={lidoFees} symbol="ETH" /> in Lido fees
          </ButtonLink>
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
