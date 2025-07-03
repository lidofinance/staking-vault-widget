import type { FC } from 'react';
import type { Address } from 'viem';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { useVault, useVaultPermission } from 'modules/vaults';

import { OverviewItemValue } from './overview-item-value';
import { ItemWrapper, Title } from './styles';

import { Hint, TokenToWallet } from 'shared/components';
import type { SectionPayload } from 'features/overview/contexts';
import { getContractAddress } from 'config';
import { useDappStatus } from 'modules/web3';

export type ItemProps = {
  payload: string | Address | number;
  color?: string;
} & Omit<SectionPayload, 'key'>;

export const OverviewItem: FC<ItemProps> = ({
  title,
  payload,
  actionLink,
  actionRole,
  action,
  hint,
  isLoading,
  color,
  addStethToWallet = false,
}) => {
  const { chainId } = useDappStatus();
  const { vaultAddress } = useVault();
  const { hasPermission } = useVaultPermission(actionRole);

  // show action if
  const showAction = !!(
    // 1. all data is provided
    (
      actionLink &&
      action &&
      vaultAddress &&
      // 2. user has permission for it (if actionRole is provided)
      (!actionRole || hasPermission)
    )
  );

  const router = useRouter();

  return (
    <ItemWrapper>
      <Title>
        <Text color="secondary" size="xxs">
          {title}
          <Hint text={hint} />
        </Text>
      </Title>
      <OverviewItemValue
        content={payload}
        extraContent={
          // TODO: rework this with overview refactor/redesign
          addStethToWallet ? (
            <TokenToWallet address={getContractAddress(chainId, 'lido')} />
          ) : undefined
        }
        isLoading={isLoading}
        color={color}
      />
      {showAction && (
        <Button
          size="xs"
          variant="translucent"
          onClick={() => router.push(actionLink(vaultAddress))}
        >
          {action}
        </Button>
      )}
    </ItemWrapper>
  );
};
