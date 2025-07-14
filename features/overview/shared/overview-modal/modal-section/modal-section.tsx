import { FC, PropsWithChildren, ReactNode } from 'react';
import { Text } from '@lidofinance/lido-ui';

import {
  HeaderText,
  SectionWrapper,
  SubTitle,
  Title,
  TitleWrapper,
} from './styles';

type ModalSectionProps = {
  title?: string;
  titleLeftDecorator?: ReactNode;
  subTitle?: string;
  amount?: string;
  description?: string;
};

export const ModalSection: FC<PropsWithChildren<ModalSectionProps>> = ({
  title,
  titleLeftDecorator = null,
  subTitle,
  amount,
  description,
  children,
}) => {
  return (
    <SectionWrapper>
      {!!title && (
        <TitleWrapper>
          <Title>
            <HeaderText as="h3">
              {titleLeftDecorator}
              {title}
            </HeaderText>
            <Text size="xs">{amount || '-'}</Text>
          </Title>
          {!!subTitle && (
            <SubTitle size="xxs" color="secondary">
              {subTitle}
            </SubTitle>
          )}
        </TitleWrapper>
      )}
      {!!description && (
        <Text color="secondary" size="xxs">
          {description}
        </Text>
      )}
      {children}
    </SectionWrapper>
  );
};
