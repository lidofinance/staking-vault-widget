import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

type DefaultItemProps = {
  payload: string;
};

export const DefaultItem: FC<DefaultItemProps> = ({ payload }) => {
  return <Text size="xxs">{payload}</Text>;
};
