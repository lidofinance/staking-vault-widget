import type { FC, PropsWithChildren } from 'react';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-triangle.svg';

import { BannerContainer, IconWrapper } from './styles';

export const BannerWithoutTitle: FC<
  PropsWithChildren<{ dataTestId?: string }>
> = ({ children, dataTestId }) => {
  return (
    <BannerContainer data-testid={dataTestId}>
      <IconWrapper>
        <WarningIcon />
      </IconWrapper>
      <div>{children}</div>
    </BannerContainer>
  );
};
