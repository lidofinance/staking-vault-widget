import { FC, PropsWithChildren } from 'react';

import { Content } from './styles';

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => {
  return <Content>{children}</Content>;
};
