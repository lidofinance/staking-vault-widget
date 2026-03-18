import type { FC, PropsWithChildren } from 'react';
import type { TextProps } from '@lidofinance/lido-ui';

import { TextInfo } from './styled';

type TextContentProps = {
  size?: TextProps['size'];
};

export const TextContent: FC<PropsWithChildren<TextContentProps>> = ({
  children,
  size,
}) => {
  return <TextInfo size={size}>{children}</TextInfo>;
};
