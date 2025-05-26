import { FC, useMemo } from 'react';
import { ChipsWrapper } from './styles';
import { getHoursDifference } from 'features/settings/main/utils';
import { Chip } from '@lidofinance/lido-ui';
import { ChipBadge } from 'features/settings/main/types';

export type ChipDecoratorProps = {
  list?: ChipBadge[];
};

export const ChipDecorator: FC<ChipDecoratorProps> = ({ list }) => {
  const listForRender = useMemo(() => {
    if (!list || list.length === 0) {
      return null;
    }

    return list
      .filter((value) => value)
      .map((value) => {
        if (typeof value === 'object') {
          return `Expires in ${getHoursDifference(value, new Date())}h`;
        }

        if (value === 'to_me') {
          return 'Proposed to me';
        }

        if (value === 'by_me') {
          return 'My proposal';
        }

        return 'Current';
      });
  }, [list]);

  if (!listForRender) {
    return null;
  }

  return (
    <ChipsWrapper>
      {listForRender.map((item) => (
        <Chip variant="gray" key={item}>
          {item}
        </Chip>
      ))}
    </ChipsWrapper>
  );
};
