import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useMemo,
} from 'react';
import { Check, Loader } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { InlineLoader } from 'shared/components';

import { Container, Content, IconWrapper } from './styled';

type PreparationStatus = 'warning' | 'success' | 'error' | 'loading';

export type PreparationItemProps = {
  status: PreparationStatus;
};

const iconList: Record<PreparationStatus, ReactNode> = {
  warning: <WarningRing />,
  success: <Check fill="var(--lido-color-success)" />,
  error: <ErrorTriangle />,
  loading: <Loader size="small" />,
};

export const PreparationItem: FC<PropsWithChildren<PreparationItemProps>> = ({
  status,
  children,
}) => {
  const icon = useMemo(() => iconList[status], [status]);
  const isLoading = status === 'loading';

  return (
    <Container>
      <IconWrapper>{icon}</IconWrapper>
      <Content>
        <InlineLoader isLoading={isLoading} height={20}>
          {children}
        </InlineLoader>
      </Content>
    </Container>
  );
};
