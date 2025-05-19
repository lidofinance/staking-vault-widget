import type { FC } from 'react';
import type { Address } from 'viem';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { useVaultInfo, useVaultPermission } from 'modules/vaults';

import { OverviewItemValue } from './overview-item-value';
import { ItemWrapper, Title } from './styles';

import type { SectionPayload } from 'features/overview/contexts';

export type ItemProps = {
  content: string | Address | number;
  color?: string;
} & Omit<SectionPayload, 'key'>;

export const OverviewItem: FC<ItemProps> = ({
  title,
  content,
  actionLink,
  actionRole,
  actionText,
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
      actionText &&
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
        </Text>
      </Title>
      <OverviewItemValue
        content={content}
        isLoading={isLoading}
        color={color}
      />
      {showAction && (
        <Button
          size="xs"
          variant="translucent"
          onClick={() => router.push(actionLink(vaultAddress))}
        >
          {actionText}
        </Button>
      )}
    </ItemWrapper>
  );
};
