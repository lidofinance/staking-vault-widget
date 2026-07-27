import { Text } from '@lidofinance/lido-ui';

import { OldToNew, TooltipHint, InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useDappStatus } from 'modules/web3';

import { useCheckAvailability } from '../../hooks';

import {
  AfterDisconnectContainer,
  ListItem,
  SupposedList,
  WithdrawableTexts,
} from './styles';

export const AfterDisconnect = () => {
  const {
    isLoading,
    isError,
    hasMintedStETH,
    isNeedSupplyForFees,
    totalValueETH,
    unsettledLidoFees,
    availableBalanceWei,
    balance,
  } = useCheckAvailability();
  const { isDappActive } = useDappStatus();

  if (isError || hasMintedStETH || isNeedSupplyForFees || !isDappActive) {
    return null;
  }

  return (
    <AfterDisconnectContainer>
      <Text size="xxs" strong>
        After disconnect
      </Text>
      <SupposedList>
        <ListItem>
          <Text size="xxs">Total Value</Text>
          <InlineLoader isLoading={isLoading} height={24} width={100}>
            <OldToNew
              old={<FormatToken amount={totalValueETH} symbol="ETH" />}
              supposed={
                <FormatToken
                  amount={totalValueETH - unsettledLidoFees}
                  symbol="ETH"
                />
              }
            />
          </InlineLoader>
        </ListItem>
        <ListItem>
          <Text size="xxs">Not staked stVault Balance</Text>
          <InlineLoader isLoading={isLoading} height={24} width={100}>
            <OldToNew
              old={<FormatToken amount={balance} symbol="ETH" />}
              supposed={
                <FormatToken
                  amount={balance - unsettledLidoFees}
                  symbol="ETH"
                />
              }
            />
          </InlineLoader>
        </ListItem>
        <ListItem>
          <Text size="xxs">Unsettled Lido fees</Text>
          <InlineLoader isLoading={isLoading} height={24} width={100}>
            <OldToNew
              old={<FormatToken amount={unsettledLidoFees} symbol="ETH" />}
              supposed="0 ETH"
            />
          </InlineLoader>
        </ListItem>
        <ListItem>
          <WithdrawableTexts>
            <Text size="xxs" as="span">
              Withdrawable ETH
            </Text>
            <TooltipHint hint="Withdrawable ETH depends on the amount of ETH in the stVault Balance and does not include ETH held on validators or in the entry or exit queues. After the stVault is disconnected from VaultHub, ETH withdrawn from exited validators automatically appears in the stVault Balance and becomes withdrawable." />
          </WithdrawableTexts>
          <InlineLoader isLoading={isLoading} height={24} width={100}>
            <OldToNew
              old={<FormatToken amount={availableBalanceWei} symbol="ETH" />}
              supposed={
                <FormatToken
                  amount={availableBalanceWei - unsettledLidoFees}
                  symbol="ETH"
                />
              }
            />
          </InlineLoader>
        </ListItem>
      </SupposedList>
    </AfterDisconnectContainer>
  );
};
