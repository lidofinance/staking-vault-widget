import type { FC, PropsWithChildren, ReactNode } from 'react';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-triangle.svg';

import { BannerContainer, IconWrapper } from './styles';

export type BannerWithoutTitle = {
  leftDecorator?: ReactNode;
  padding?: string;
  dataTestId?: string;
};

export const BannerWithoutTitle: FC<PropsWithChildren<BannerWithoutTitle>> = ({
  children,
  leftDecorator,
  padding,
  dataTestId,
}) => {
  return (
    <BannerContainer $padding={padding} data-testid={dataTestId}>
      <IconWrapper>
        {leftDecorator ? leftDecorator : <WarningIcon />}
      </IconWrapper>
      <div>{children}</div>
    </BannerContainer>
  );
};
