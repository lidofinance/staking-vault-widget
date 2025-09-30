import { ReactNode, FC } from 'react';
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
    navigate: () => void;
  }[];
  type?: NoticeContainerType;
};

const iconsMap: Record<NoticeContainerType, ReactNode> = {
  warning: <WarningTriangle color="#EC8600" />,
  info: <WarningTriangle color="#7A8AA0" />,
  error: <ErrorTriangle />,
};

export const NoticeContainer: FC<NoticeContainerProps> = (props) => {
  const { title, description, note, actions, type = 'warning' } = props;

  return (
    <Wrapper type={type}>
      <div>
        <Title as="h2" color="text">
          {iconsMap[type]} {title}
        </Title>
        <Text size="xxs">{description}</Text>
      </div>
      {!!actions && (
        <ActionContainer>
          {actions.map((action, index) => {
            const showDivider = actions.length !== index + 1;

            return (
              <>
                <ActionWrapper key={action.title}>
                  <Text size="xxs" strong>
                    {action.title}
                  </Text>
                  <ActionButton
                    onClick={action.navigate}
                    size="sm"
                    variant="outlined"
                    color="secondary"
                  >
                    {action.buttonText}
                  </ActionButton>
                </ActionWrapper>
                {showDivider && <SectionDivider type="vertical" />}
              </>
            );
          })}
        </ActionContainer>
      )}
      {!!note && <Text size="xxs">{note}</Text>}
    </Wrapper>
  );
};
