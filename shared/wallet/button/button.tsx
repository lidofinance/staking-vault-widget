import { FC } from 'react';
import type { Address } from 'viem';
import { ButtonProps, useBreakpoint } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { useDappStatus, useEthereumBalance } from 'modules/web3';
import { InlineLoader } from 'shared/components';

import { AddressBadge } from '../components/address-badge/address-badge';
import { useWalletModal } from '../wallet-modal/use-wallet-modal';

import {
  WalledButtonStyle,
  WalledButtonWrapperStyle,
  WalledButtonBalanceStyle,
} from './styles';

export const Button: FC<ButtonProps> = (props) => {
  const { onClick, ...rest } = props;

  const isMobile = useBreakpoint('md');
  const { isDappActive, address } = useDappStatus();

  const { openModal } = useWalletModal();
  const { data: balance, isLoading } = useEthereumBalance();

  return (
    <WalledButtonStyle
      size="sm"
      variant="text"
      color="secondary"
      onClick={() => openModal({})}
      $isAddPaddingLeft={!isLoading && !isDappActive && !isMobile}
      {...rest}
    >
      <WalledButtonWrapperStyle>
        <WalledButtonBalanceStyle>
          <InlineLoader isLoading={isLoading} width={60}>
            {isDappActive && (
              <FormatToken
                amount={balance}
                symbol="ETH"
                showAmountTip={false}
              />
            )}
          </InlineLoader>
        </WalledButtonBalanceStyle>
        <AddressBadge address={address as Address} />
      </WalledButtonWrapperStyle>
    </WalledButtonStyle>
  );
};
