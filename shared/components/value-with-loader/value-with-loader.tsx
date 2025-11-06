import type { FC, PropsWithChildren } from 'react';

import { InlineLoaderStyled } from './styles';

type InlineLoaderProps = {
  isLoading: boolean;
  width?: number;
  height?: number;
  placeholder?: React.ReactNode;
};

export const InlineLoader: FC<PropsWithChildren<InlineLoaderProps>> = ({
  placeholder,
  isLoading,
  children,
  width,
  height,
}) => {
  if (isLoading) return <InlineLoaderStyled width={width} height={height} />;
  if (children === undefined) return placeholder || null;

  return children;
};
