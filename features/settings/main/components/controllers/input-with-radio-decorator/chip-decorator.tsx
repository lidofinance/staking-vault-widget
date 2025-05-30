import { FC, useMemo } from 'react';
import { Chip } from '@lidofinance/lido-ui';

import { getHoursDifference } from 'features/settings/main/utils';
import { VotingOptionType } from 'features/settings/main/types';

import { ChipsWrapper } from './styles';

export type ChipDecoratorProps = {
  field: VotingOptionType;
};

const typeLabels: Record<VotingOptionType['type'], string> = {
  to_me: 'Proposed to me',
  by_me: 'My proposal',
  current: 'Current',
};

export const ChipDecorator: FC<ChipDecoratorProps> = ({ field }) => {
  const listForRender = useMemo(() => {
    const { type, expiryDate } = field;
    const list = [typeLabels[type]];

    if (expiryDate) {
      list.unshift(`Expires in ${getHoursDifference(expiryDate, new Date())}h`);
    }

    return list;
  }, [field]);

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
