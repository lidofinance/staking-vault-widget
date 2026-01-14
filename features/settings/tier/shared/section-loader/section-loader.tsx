import type { FC } from 'react';

import { InlineLoaderStyled } from './styles';

type SectionLoaderProps = {
  loaderHeight: number;
};

export const SectionLoader: FC<SectionLoaderProps> = ({ loaderHeight }) => {
  return <InlineLoaderStyled $height={loaderHeight} />;
};
