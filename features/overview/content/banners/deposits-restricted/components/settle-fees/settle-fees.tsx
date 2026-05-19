import { type FC, useCallback, useMemo } from 'react';
import { useConnect } from 'reef-knot/core-react';

import { FormatToken } from 'shared/formatters';
import { ONE_ETHER } from 'consts/tx';
import { useSettleLidoFees } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { ListItem, ListItemContent } from '../styles';
import { ButtonLink } from './styles';
import { TextStyled } from '../../../styles';

type SettleFeesProps = {
  lidoFees: bigint | undefined;
};

export const SettleFees: FC<SettleFeesProps> = ({ lidoFees }) => {
  const { settleLidoFees } = useSettleLidoFees();
  const { isDappActive } = useDappStatus();
  const { connect } = useConnect();

  const handleConnect = useCallback(() => {
    void connect();
  }, [connect]);

  const content = useMemo(
    () =>
      isDappActive ? (
        <>
          Settle <FormatToken amount={lidoFees} symbol="ETH" /> in Lido fees
        </>
      ) : (
        'Connect wallet for settling Lido fees'
      ),
    [isDappActive, lidoFees],
  );

  if (!lidoFees || lidoFees < ONE_ETHER) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <TextStyled size="xxs">
          <ButtonLink
            role="button"
            onClick={isDappActive ? settleLidoFees : handleConnect}
          >
            {content}
          </ButtonLink>
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
