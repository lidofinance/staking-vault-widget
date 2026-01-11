import type { FC, ReactNode } from 'react';
import { Text, ArrowRight } from '@lidofinance/lido-ui';

import { Wrapper } from './styles';

type OldToNewProps = {
  old: ReactNode;
  supposed?: ReactNode;
  isChanged?: boolean;
};

export const OldToNew: FC<OldToNewProps> = ({
  old,
  supposed,
  isChanged = true,
}) => {
  if (!isChanged || !supposed || old === supposed) {
    return (
      <Wrapper>
        <Text size="xxs" color="secondary">
          {old}
        </Text>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Text size="xxs" color="secondary">
        {old}
      </Text>
      <ArrowRight />
      <Text size="xxs">{supposed}</Text>
    </Wrapper>
  );
};
