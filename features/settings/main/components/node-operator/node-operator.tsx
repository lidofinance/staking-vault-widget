import { FC, useMemo } from 'react';
import { Address } from 'viem';
import invariant from 'tiny-invariant';

import { Copy, External, ToastSuccess, Text } from '@lidofinance/lido-ui';
import {
  AddressBadge,
  AddressLinkEtherscan,
  ButtonLink,
  Hint,
} from 'shared/components';

import { ActionGroup, ActionWrapper, Content, Wrapper } from './styles';

import { truncateAddress } from 'utils/truncate-address';
import { useVaultInfo, vaultTexts } from 'modules/vaults';

const texts = vaultTexts.actions.settings.fields.nodeOperator;

export const NodeOperator: FC = () => {
  const { activeVault } = useVaultInfo();
  const nodeOperatorAddress = useMemo(
    () => activeVault?.nodeOperator,
    [activeVault],
  );

  const handleCopyLink = () => {
    invariant(nodeOperatorAddress, 'Node operator address is not defined');
    void navigator.clipboard.writeText(nodeOperatorAddress);
    ToastSuccess(
      `Address ${truncateAddress({ address: nodeOperatorAddress })} have been copied`,
    );
  };

  return (
    <Wrapper>
      <Content>
        <Text size="xs" strong>
          {texts.title}
          <Hint text={texts.hint} />
        </Text>
        <AddressBadge weight={400} address={nodeOperatorAddress} symbols={21} />
        <ActionGroup>
          <ActionWrapper>
            <Copy fill="var(--lido-color-primary)" />
            <ButtonLink onClick={handleCopyLink}>Copy address</ButtonLink>
          </ActionWrapper>
          <ActionWrapper>
            <External fill="var(--lido-color-primary)" />
            <AddressLinkEtherscan address={nodeOperatorAddress as Address} />
          </ActionWrapper>
        </ActionGroup>
      </Content>
    </Wrapper>
  );
};
