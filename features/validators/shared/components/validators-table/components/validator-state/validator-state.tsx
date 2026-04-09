import { type FC, useCallback } from 'react';
import { Tooltip, ToastSuccess } from '@lidofinance/lido-ui';

import { ReactComponent as SatelliteNetwork } from 'assets/icons/satellite-network.svg';
import { truncateAddress } from 'utils';

import {
  CopyButton,
  CopyIconStyled,
  StateContainer,
  TextStyled,
} from './styles';

type ValidatorStateProps = {
  type: 'index' | 'pubkey';
  indexOrPubkey: string;
};

export const ValidatorState: FC<ValidatorStateProps> = ({
  indexOrPubkey,
  type,
}) => {
  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(indexOrPubkey);
    const info =
      type === 'pubkey'
        ? truncateAddress({ address: indexOrPubkey })
        : indexOrPubkey;
    ToastSuccess(`Validator's ${type} ${info} have been copied`);
  }, [indexOrPubkey, type]);

  return (
    <StateContainer>
      <TextStyled size="xxs">{indexOrPubkey}</TextStyled>
      <SatelliteNetwork />
      <CopyButton onClick={handleCopy}>
        <Tooltip title={`Copy ${type}`}>
          <CopyIconStyled />
        </Tooltip>
      </CopyButton>
    </StateContainer>
  );
};
