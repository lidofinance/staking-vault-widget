import type { FC, ReactNode } from 'react';
import { Text, ArrowRight } from '@lidofinance/lido-ui';

import { Wrapper } from './styles';

type OldToNewProps = {
  old: ReactNode;
  supposed?: ReactNode;
  isChanged?: boolean;
  dataTestId?: string;
};

export const OldToNew: FC<OldToNewProps> = ({
  old,
  supposed,
  isChanged = true,
  dataTestId,
}) => {
  if (!isChanged || !supposed || old === supposed) {
    return (
      <Wrapper>
        <Text
          size="xxs"
          color="secondary"
          data-testid={dataTestId ? `${dataTestId}` : undefined}
        >
          {old}
        </Text>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Text
        size="xxs"
        color="secondary"
        data-testid={dataTestId ? `${dataTestId}-before` : undefined}
      >
        {old}
      </Text>
      <ArrowRight />
      <Text
        size="xxs"
        data-testid={dataTestId ? `${dataTestId}-after` : undefined}
      >
        {supposed}
      </Text>
    </Wrapper>
  );
};
