import { type FC, useCallback, useMemo } from 'react';
import { Tooltip, ToastSuccess } from '@lidofinance/lido-ui';

import { ReactComponent as SatelliteNetwork } from 'assets/icons/satellite-network.svg';
import { useLidoSDK } from 'modules/web3';
import { isNumber, truncateAddress } from 'utils';

import {
  CopyButton,
  CopyIconStyled,
  LinkStyled,
  StateContainer,
  TextStyled,
} from './styles';

type ValidatorStateProps = {
  type: 'index' | 'pubkey';
  indexOrPubkey: string;
};

const beaconchaLinkByNetwork = {
  [1]: 'https://beaconcha.in/validator/',
  [560048]: 'https://hoodi.beaconcha.in/validator/',
};

export const ValidatorState: FC<ValidatorStateProps> = ({
  indexOrPubkey,
  type,
}) => {
  const { publicClient } = useLidoSDK();
  const content = type === 'index' ? `#${indexOrPubkey}` : indexOrPubkey;

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(indexOrPubkey);
    const info =
      type === 'pubkey'
        ? truncateAddress({ address: indexOrPubkey })
        : indexOrPubkey;
    ToastSuccess(`Validator's ${type} ${info} have been copied`);
  }, [indexOrPubkey, type]);

  const link = useMemo(() => {
    const chainId = publicClient.chain.id as 1 | 560048 | undefined; // only hoodi or mainnet;
    if (!isNumber(chainId)) {
      return '#';
    }

    return `${beaconchaLinkByNetwork[chainId]}${indexOrPubkey}`;
  }, [publicClient, indexOrPubkey]);

  return (
    <StateContainer>
      <TextStyled size="xxs">{content}</TextStyled>
      <LinkStyled href={link} target="_blank" rel="noreferrer noopener">
        <SatelliteNetwork />
      </LinkStyled>
      <CopyButton onClick={handleCopy}>
        <Tooltip title={`Copy ${type}`}>
          <CopyIconStyled />
        </Tooltip>
      </CopyButton>
    </StateContainer>
  );
};
