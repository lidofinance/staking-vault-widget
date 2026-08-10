import type { FC, PropsWithChildren } from 'react';

import { InlineLoader } from 'shared/components';

import { LoaderContainer } from './styles';

type DescriptionLoaderProps = {
  isLoading: boolean;
};

export const DescriptionLoader: FC<
  PropsWithChildren<DescriptionLoaderProps>
> = ({ children, isLoading }) => {
  if (isLoading) {
    return (
      <LoaderContainer>
        <InlineLoader isLoading width="100%" height={24} />
        <InlineLoader isLoading width={200} height={24} />
      </LoaderContainer>
    );
  }

  return <>{children}</>;
};
