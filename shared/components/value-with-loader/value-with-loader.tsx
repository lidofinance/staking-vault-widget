import type { FC, PropsWithChildren, ReactNode } from 'react';

import { InlineLoaderStyled } from './styles';

type InlineLoaderProps = {
  isLoading: boolean | undefined;
  width?: number | `${number}px` | `${number}%`;
  height?: number | `${number}px` | `${number}%`;
  placeholder?: ReactNode;
  loader?: ReactNode;
  showBy?: boolean;
};

export const InlineLoader: FC<PropsWithChildren<InlineLoaderProps>> = ({
  placeholder,
  isLoading,
  children,
  loader,
  width,
  height,
  showBy,
}) => {
  if (isLoading)
    return loader ? (
      loader
    ) : (
      <InlineLoaderStyled width={width} height={height} />
    );

  if (showBy === false) return placeholder ?? null;
  if (children === undefined) return placeholder || null;

  return children;
};
