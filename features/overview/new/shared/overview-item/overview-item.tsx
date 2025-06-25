import type { FC } from 'react';
import type { Address } from 'viem';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { useVaultInfo, useVaultPermission } from 'modules/vaults';

import { OverviewItemValue } from './overview-item-value';
import { ItemWrapper, Title } from './styles';

import { Hint } from 'shared/components';
import type { SectionPayload } from 'features/overview/contexts';

export type ItemProps = {
  payload: string | Address | number | boolean;
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
}) => {
  const { vaultAddress } = useVaultInfo();
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
    <ItemWrapper filled>
      <Title>
        <Text color="secondary" size="xxs">
          {title}
        </Text>
        <Hint text={hint} />
      </Title>
      <OverviewItemValue
        content={payload}
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
