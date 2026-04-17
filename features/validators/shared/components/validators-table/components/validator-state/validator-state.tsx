import { type FC, useCallback } from 'react';
import { Tooltip, ToastSuccess, Text, ToastError } from '@lidofinance/lido-ui';

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
  const isTypeIndex = type === 'index';
  const content = isTypeIndex ? `#${indexOrPubkey}` : indexOrPubkey;

  const handleCopy = useCallback(() => {
    try {
      void navigator.clipboard.writeText(indexOrPubkey);
      const info = truncateAddress({ address: indexOrPubkey });
      ToastSuccess(`Validator's pubkey ${info} has been copied`);
    } catch (err) {
      if (err instanceof Error) {
        ToastError(`Cannot copy pubkey ${err.message}`);
      }
    }
  }, [indexOrPubkey]);

  return (
    <StateContainer>
      <TextStyled size="xxs">{content}</TextStyled>
      {!isTypeIndex && (
        <>
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
        </>
      )}
    </StateContainer>
  );
};
