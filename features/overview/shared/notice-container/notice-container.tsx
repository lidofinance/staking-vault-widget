import type { ReactNode, FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import {
  Wrapper,
  Title,
  ActionButton,
  ActionWrapper,
  ActionContainer,
} from './styles';
import { SectionDivider } from '../styles';

type NoticeContainerType = 'warning' | 'error' | 'info';

export type NoticeContainerProps = {
  title: string;
  description: ReactNode;
  note?: string;
  actions?: {
    buttonText: string;
    title: string;
    onClick: () => void;
  }[];
  type?: NoticeContainerType;
};

const iconsMap: Record<NoticeContainerType, ReactNode> = {
  warning: <WarningTriangle color="#EC8600" />,
  info: <WarningTriangle color="#7A8AA0" />,
  error: <ErrorTriangle />,
};

export const NoticeContainer: FC<PropsWithChildren<NoticeContainerProps>> = (
  props,
) => {
  const {
    title,
    description,
    note,
    actions = [],
    type = 'warning',
    children,
  } = props;

  return (
    <Wrapper type={type}>
      <div>
        <Title as="h2" color="text">
          {iconsMap[type]} {title}
        </Title>
        <Text size="xxs">{description}</Text>
      </div>
      {actions.length > 0 && (
        <ActionContainer>
          {actions.map(({ title, onClick, buttonText }, index) => {
            const showDivider = actions.length !== index + 1;

            return (
              <>
                <ActionWrapper key={title}>
                  <Text size="xxs" strong>
                    {title}
                  </Text>
                  <ActionButton
                    onClick={onClick}
                    size="sm"
                    variant="outlined"
                    color="secondary"
                  >
                    {buttonText}
                  </ActionButton>
                </ActionWrapper>
                {showDivider && <SectionDivider type="vertical" />}
              </>
            );
          })}
        </ActionContainer>
      )}
      {children}
      {!!note && <Text size="xxs">{note}</Text>}
    </Wrapper>
  );
};
