import type { FC } from 'react';

import { InlineLoader } from 'shared/components';

import { LoaderItem } from './styles';

type NavigationListLoaderProps = {
  count: number;
};

export const NavigationListLoader: FC<NavigationListLoaderProps> = ({
  count,
}) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <LoaderItem key={index} data-testid="navLinkLoader">
          <InlineLoader isLoading width={140} height={24} />
        </LoaderItem>
      ))}
    </>
  );
};
