import type { ReactNode, FC, PropsWithChildren } from 'react';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';
import { ReactComponent as Info } from 'assets/icons/info.svg';

import { Wrapper, Title, TitleContainer, TextStyled } from './styles';

type NoticeContainerType = 'warning' | 'error' | 'info';

export type NoticeContainerProps = {
  title: string;
  description?: ReactNode;
  note?: string;
  type?: NoticeContainerType;
};

const iconsMap: Record<NoticeContainerType, ReactNode> = {
  warning: <WarningRing />,
  info: <Info />,
  error: <ErrorTriangle />,
};

export const NoticeContainer: FC<PropsWithChildren<NoticeContainerProps>> = (
  props,
) => {
  const { title, description, note, type = 'warning', children } = props;

  return (
    <Wrapper type={type}>
      <TitleContainer>
        <Title as="h2" color="text">
          {iconsMap[type]} {title}
        </Title>
        {!!description && <TextStyled size="xxs">{description}</TextStyled>}
      </TitleContainer>
      {children}
      {!!note && <TextStyled size="xxs">{note}</TextStyled>}
    </Wrapper>
  );
};
