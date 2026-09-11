import { FC, PropsWithChildren, ReactNode } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import {
  ContentWrapper,
  DecoratorWrapper,
  DescriptionWrapper,
  HeaderText,
  SectionWrapper,
  SubTitle,
  Title,
  TitleWrapper,
} from './styles';

type ModalSectionProps = {
  title?: string;
  titleLeftDecorator?: ReactNode;
  titleRightDecorator?: ReactNode;
  subTitle?: string;
  amountType?: 'percent' | 'token';
  amountValue?: string | bigint;
  amountSymbol?: 'stETH' | 'ETH';
  description?: string;
  // renders the description tight under the row, for the inline '~10 minutes' footnotes
  compactDescription?: boolean;
  dataTestId?: string;
};

export const ModalSection: FC<PropsWithChildren<ModalSectionProps>> = ({
  title,
  titleLeftDecorator = null,
  titleRightDecorator = null,
  subTitle,
  amountType,
  amountValue,
  amountSymbol,
  description,
  compactDescription = false,
  children,
  dataTestId,
}) => {
  return (
    <SectionWrapper data-testid={dataTestId}>
      {!!titleLeftDecorator && (
        <DecoratorWrapper>{titleLeftDecorator}</DecoratorWrapper>
      )}
      <ContentWrapper>
        {!!title && (
          <TitleWrapper>
            <Title>
              <HeaderText as="h3">
                {title}
                {titleRightDecorator}
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
          <DescriptionWrapper $compact={compactDescription}>
            <Text color="secondary" size="xxs">
              {description}
            </Text>
          </DescriptionWrapper>
        )}
        {children}
      </ContentWrapper>
    </SectionWrapper>
  );
};
