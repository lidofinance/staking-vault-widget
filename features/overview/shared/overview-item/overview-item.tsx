import { FC } from 'react';

import { Text, Button } from '@lidofinance/lido-ui';
import { ItemWrapper, Title } from './styles';
import { useRouter } from 'next/router';
import { useVaultInfo } from 'features/overview/contexts';

export interface ItemProps {
  title: string;
  content: string | number | undefined;
  actionLink?: string;
  actionText?: string;
  isSuccess?: boolean;
}

export const OverviewItem: FC<ItemProps> = (props) => {
  const router = useRouter();
  const { activeVault } = useVaultInfo();
  const { title, content, isSuccess, actionLink, actionText } = props;
  const contentColor = isSuccess ? 'success' : 'default';

  return (
    <ItemWrapper>
      <Title>
        <Text color="secondary" size="xxs">
          {title}
        </Text>
      </Title>
      <Text size="lg" color={contentColor} strong>
        {content ?? '-'}
      </Text>
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
