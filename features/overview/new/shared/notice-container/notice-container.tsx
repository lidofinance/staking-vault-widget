import { ReactNode, FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import { Wrapper, Title } from './styles';

type NoticeContainerType = 'warning' | 'error';

export type NoticeContainerProps = {
  title: string;
  description: string;
  note: string;
  type?: NoticeContainerType;
};

const iconsMap: Record<NoticeContainerType, ReactNode> = {
  warning: <WarningTriangle />,
  error: <ErrorTriangle />,
};

export const NoticeContainer: FC<PropsWithChildren<NoticeContainerProps>> = (
  props,
) => {
  const { title, description, note, type = 'warning', children } = props;

  return (
    <Wrapper type={type}>
      <div>
        <Title as="h2" color="text">
          {iconsMap[type]} {title}
        </Title>
        <Text size="xxs">{description}</Text>
      </div>
      {children}
      <Text size="xxs">{note}</Text>
    </Wrapper>
  );
};
