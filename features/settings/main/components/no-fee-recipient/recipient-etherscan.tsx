import { useMemo } from 'react';
import Link from 'next/link';
import { External } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { getEtherscanAddressLink } from 'utils/etherscan';
import { config } from 'config';

import { MainSettingsFormValidatedValues } from 'features/settings/main/types';

export const RecipientEtherscan = () => {
  const { walletChainId } = useDappStatus();
  const nodeOperatorFeeRecipient = useWatch<MainSettingsFormValidatedValues>({
    name: 'feeRecipient',
  }) as string;
  const link = useMemo(
    () =>
      getEtherscanAddressLink(
        walletChainId ?? config.defaultChain,
        nodeOperatorFeeRecipient ?? '',
      ),
    [walletChainId, nodeOperatorFeeRecipient],
  );

  return (
    <Link target="_blank" href={link}>
      <External />
    </Link>
  );
};
