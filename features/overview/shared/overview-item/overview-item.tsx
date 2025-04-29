import { FC } from 'react';

import { Text, Button } from '@lidofinance/lido-ui';
import { ItemWrapper, Title } from './styles';
import { useRouter } from 'next/router';
import { useVaultInfo } from 'modules/vaults';

import { OverviewItemValue } from './overview-item-value';

export interface ItemProps {
  title: string;
  content: string | number | undefined;
  actionLink?: string;
  actionText?: string;
  isLoading?: boolean;
  color?: string;
}

export const OverviewItem: FC<ItemProps> = (props) => {
  const router = useRouter();
  const { activeVault } = useVaultInfo();
  const { title, content, actionLink, actionText, isLoading, color } = props;

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
      {!!actionLink && !!actionText && (
        <Button
          size="xs"
          variant="translucent"
          onClick={() => router.push(`/${activeVault?.address}${actionLink}`)}
        >
          {actionText}
        </Button>
      )}
    </ItemWrapper>
  );
};
