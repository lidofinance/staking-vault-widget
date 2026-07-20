import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react';
import { Container, IconWrapper } from './styles';

import { ReactComponent as WarningIcon } from 'assets/icons/warning-triangle.svg';
import { ReactComponent as ErrorIcon } from 'assets/icons/error-triangle.svg';

type InfoBannerProps = {
  type?: 'warning' | 'danger';
  'data-testid'?: string;
};

const iconsMap: Record<'warning' | 'danger', ReactNode> = {
  warning: <WarningIcon color="var(--lido-color-warning)" />,
  danger: <ErrorIcon />,
};

export const InfoBanner: FC<PropsWithChildren<InfoBannerProps>> = ({
  type = 'warning',
  'data-testid': dataTestId,
  children,
}) => {
  const icon = useMemo(() => iconsMap[type], [type]);

  return (
    <Container $type={type} data-testid={dataTestId}>
      <IconWrapper>{icon}</IconWrapper>
      {children}
    </Container>
  );
};
