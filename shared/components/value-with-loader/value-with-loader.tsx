import type { FC, PropsWithChildren } from 'react';

import { InlineLoaderStyled } from './styles';

type ValueWithLoaderProps = {
  isLoading: boolean;
  width?: string;
  placeholder?: string | number | undefined;
};

export const ValueWithLoader: FC<PropsWithChildren<ValueWithLoaderProps>> = ({
  placeholder,
  isLoading,
  children,
  width,
}) => {
  if (isLoading) return <InlineLoaderStyled width={width} />;
  if (children === undefined) return placeholder || null;

  return children;
};
