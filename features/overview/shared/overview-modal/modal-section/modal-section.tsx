import { FC, PropsWithChildren, ReactNode } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

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
  amountType?: 'percent' | 'token';
  amountValue?: string | bigint;
  amountSymbol?: 'stETH' | 'ETH';
  description?: string;
  dataTestId?: string;
};

export const ModalSection: FC<PropsWithChildren<ModalSectionProps>> = ({
  title,
  titleLeftDecorator = null,
  subTitle,
  amountType,
  amountValue,
  amountSymbol,
  description,
  children,
  dataTestId,
}) => {
  return (
    <SectionWrapper data-testid={dataTestId}>
      {!!title && (
        <TitleWrapper>
          <Title>
            <HeaderText as="h3">
              {titleLeftDecorator}
              {title}
            </HeaderText>
            <Text size="xs">
              {!amountType && '-'}
              {amountType === 'percent' && <>{amountValue}</>}
              {amountType === 'token' && (
                <FormatToken
                  amount={amountValue as bigint}
                  maxDecimalDigits={8}
                  symbol={amountSymbol ?? 'stETH'}
                />
              )}
            </Text>
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
