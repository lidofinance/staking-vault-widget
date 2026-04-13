import { type FC, useCallback } from 'react';
import { Tooltip, ToastSuccess, Text } from '@lidofinance/lido-ui';

import { truncateAddress } from 'utils';

import { SatelliteBeaconchaLink } from '../../../satellite-beaconcha-link';
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
  const content = type === 'index' ? `#${indexOrPubkey}` : indexOrPubkey;

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
      <TextStyled size="xxs">{content}</TextStyled>
      <Text color="secondary">
        <SatelliteBeaconchaLink indexOrPubkey={indexOrPubkey} />
      </Text>
      <CopyButton onClick={handleCopy}>
        <Tooltip title={`Copy ${type}`}>
          <CopyIconStyled />
        </Tooltip>
      </CopyButton>
    </StateContainer>
  );
};
