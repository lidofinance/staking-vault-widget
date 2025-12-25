import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { InlineLoaderStyled, LoaderWrapper } from './styles';

type SectionLoaderProps = {
  loaderHeight: number;
  title: string;
};

export const SectionLoader: FC<SectionLoaderProps> = ({
  loaderHeight,
  title,
}) => {
  return (
    <LoaderWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      <InlineLoaderStyled $height={loaderHeight} />
    </LoaderWrapper>
  );
};
