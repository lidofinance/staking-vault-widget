import { FC } from 'react';
import { InlineLoader } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { isBigint } from 'utils';

import { LoaderWrapper, ContentText } from './styles';

export interface ItemValueProps {
  content: string | number | undefined | boolean | bigint;
  isLoading?: boolean;
  color?: string;
  symbol?: string;
  textSize?: 'lg' | 'xl';
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color, textSize = 'xl', symbol = '' } = props;
  const contentView = isBigint(content) ? (
    <FormatToken
      amount={content}
      maxDecimalDigits={4}
      showAmountTip={false}
      symbol={symbol}
    />
  ) : (
    content
  );

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <ContentText
          data-testid="blockValue"
          size={textSize}
          style={{ color }}
          strong
        >
          {contentView || '-'}
        </ContentText>
      )}
    </>
  );
};
