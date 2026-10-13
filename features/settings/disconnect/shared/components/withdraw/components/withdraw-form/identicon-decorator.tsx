import { useWatch } from 'react-hook-form';
import { Identicon } from '@lidofinance/lido-ui';
import { isAddress } from 'viem';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';

import type { DisconnectWithdrawFormFieldValues } from './types';

export const IdenticonDecorator = () => {
  const recipient = useWatch<DisconnectWithdrawFormFieldValues, 'recipient'>({
    name: 'recipient',
  });

  if (isAddress(recipient)) {
    return <Identicon address={recipient} diameter={20} />;
  }

  return <ErrorTriangle />;
};
