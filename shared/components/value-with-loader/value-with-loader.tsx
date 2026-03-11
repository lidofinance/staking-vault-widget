import type { FC, PropsWithChildren, ReactNode } from 'react';

import { InlineLoaderStyled } from './styles';

type InlineLoaderProps = {
  isLoading: boolean | undefined;
  width?: number;
  height?: number;
  placeholder?: ReactNode;
  loader?: ReactNode;
};

export const InlineLoader: FC<PropsWithChildren<InlineLoaderProps>> = ({
  placeholder,
  isLoading,
  children,
  loader,
  width,
  height,
}) => {
  if (isLoading)
    return loader ? (
      loader
    ) : (
      <InlineLoaderStyled width={width} height={height} />
    );
  if (children === undefined) return placeholder || null;

  return children;
};
