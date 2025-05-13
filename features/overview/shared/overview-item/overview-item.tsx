import { FC } from 'react';

import { Text, Button } from '@lidofinance/lido-ui';
import { ItemWrapper, Title } from './styles';
import { useRouter } from 'next/router';
import { useVaultInfo } from 'modules/vaults';

import { OverviewItemValue } from './overview-item-value';

import type { Address } from 'viem';

export type ItemProps = {
  title: string;
  content: string | number | undefined;
  actionLink?: (vaultAddress: Address) => string;
  actionText?: string;
  isLoading?: boolean;
  color?: string;
};

export const OverviewItem: FC<ItemProps> = ({
  title,
  content,
  actionLink,
  actionText,
  isLoading,
  color,
}) => {
  const { vaultAddress } = useVaultInfo();
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
      {!!(actionLink && actionText && vaultAddress) && (
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
