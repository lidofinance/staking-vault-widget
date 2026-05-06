import type { FC, PropsWithChildren } from 'react';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-triangle.svg';

import { BannerContainer, IconWrapper } from './styles';

export const BannerBase: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BannerContainer>
      <IconWrapper>
        <WarningIcon />
      </IconWrapper>
      <div>{children}</div>
    </BannerContainer>
  );
};
