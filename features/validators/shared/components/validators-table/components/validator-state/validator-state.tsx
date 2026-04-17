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
    try {
      void navigator.clipboard.writeText(indexOrPubkey);
      const info =
        type === 'pubkey'
          ? truncateAddress({ address: indexOrPubkey })
          : indexOrPubkey;
      ToastSuccess(`Validator's ${type} ${info} has been copied`);
    } catch (e) {
      console.error('Cannot copy index or pubkey', e);
    }
  }, [indexOrPubkey, type]);

  return (
    <StateContainer>
      <TextStyled size="xxs">{content}</TextStyled>
      <Tooltip title="Beaconcha.in">
        <Text color="secondary">
          <SatelliteBeaconchaLink indexOrPubkey={indexOrPubkey} />
        </Text>
      </Tooltip>
      <CopyButton onClick={handleCopy}>
        <Tooltip title={`Copy ${type}`}>
          <CopyIconStyled />
        </Tooltip>
      </CopyButton>
    </StateContainer>
  );
};
