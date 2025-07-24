import { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { PartitionWrapper } from './styles';

type PartitionContainerProps = {
  title: string;
};

export const PartitionContainer: FC<
  PropsWithChildren<PartitionContainerProps>
> = ({ title, children }) => {
  return (
    <PartitionWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      {children}
    </PartitionWrapper>
  );
};
