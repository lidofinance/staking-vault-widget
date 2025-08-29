import { FC } from 'react';
import { Text, ArrowRight } from '@lidofinance/lido-ui';

import { Wrapper } from './styles';

type OldToNewProps = {
  old: string;
  supposed?: string;
};

export const OldToNew: FC<OldToNewProps> = ({ old, supposed }) => {
  return (
    <Wrapper>
      <Text size="xxs" color="secondary">
        {old}
      </Text>
      {supposed && (
        <>
          <ArrowRight />
          <Text size="xxs">{supposed}</Text>
        </>
      )}
    </Wrapper>
  );
};
