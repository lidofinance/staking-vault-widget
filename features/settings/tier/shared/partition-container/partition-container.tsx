import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { PartitionWrapper } from './styles';

type PartitionContainerProps = {
  title: string;
  isLoading?: boolean;
  fallback?: ReactNode;
};

export const PartitionContainer: FC<
  PropsWithChildren<PartitionContainerProps>
> = ({ title, children, fallback, isLoading }) => {
  return (
    <PartitionWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      {isLoading && fallback ? fallback : children}
    </PartitionWrapper>
  );
};
