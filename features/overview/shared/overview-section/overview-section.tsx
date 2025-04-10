import { FC, PropsWithChildren, ReactNode } from 'react';

import { Block, Text, Tooltip, Question } from '@lidofinance/lido-ui';
import { Content, ContentWrapper, Title } from './styles';

export interface OverviewSectionProps {
  title?: string;
  titleTooltip?: string;
  titleContent?: ReactNode;
}

export const OverviewSection: FC<PropsWithChildren<OverviewSectionProps>> = (
  props,
) => {
  const { title, titleTooltip, titleContent = null, children } = props;

  return (
    <Block>
      <ContentWrapper>
        <section>
          {!!title && (
            <Title>
              <Text size="lg" strong>
                {title}
              </Text>
              {!!titleTooltip && (
                <Tooltip title={titleTooltip}>
                  <Question />
                </Tooltip>
              )}
            </Title>
          )}
          {titleContent}
        </section>
        <Content>{children}</Content>
      </ContentWrapper>
    </Block>
  );
};
