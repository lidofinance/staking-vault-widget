import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Loader, type LoaderProps } from '@lidofinance/lido-ui';
import { CircleLoaderContainer } from './styles';

type InlineLoaderProps = {
  isLoading: boolean | undefined;
  showBy?: boolean;
  placeholder?: ReactNode;
  loader?: ReactNode;
  width?: `${number}px` | `${number}%`;
  height?: `${number}px` | `${number}%`;
} & LoaderProps;

export const CircleLoader: FC<PropsWithChildren<InlineLoaderProps>> = ({
  placeholder,
  isLoading,
  showBy,
  children,
  loader,
  width,
  height,
  size = 'small',
}) => {
  if (isLoading)
    return loader ? (
      loader
    ) : (
      <CircleLoaderContainer width={width} height={height}>
        <Loader size={size} />
      </CircleLoaderContainer>
    );
  if (showBy === false) return placeholder ?? null;
  if (children === undefined) return placeholder ?? null;

  return children;
};
