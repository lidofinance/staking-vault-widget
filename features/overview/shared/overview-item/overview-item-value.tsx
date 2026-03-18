import { type FC, useMemo } from 'react';

import { InlineLoader } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { isBigint } from 'utils';

import { ContentText } from './styles';

export interface ItemValueProps {
  content: string | number | undefined | boolean | bigint;
  isLoading?: boolean;
  color?: string;
  symbol?: string;
  textSize?: 'lg' | 'xl';
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color, textSize = 'xl', symbol = '' } = props;
  const contentView = useMemo(
    () =>
      isBigint(content) ? (
        <FormatToken
          amount={content}
          maxDecimalDigits={4}
          showAmountTip={false}
          symbol={symbol}
        />
      ) : (
        content
      ),
    [content, symbol],
  );

  return (
    <InlineLoader isLoading={isLoading} width={100} height={28}>
      <ContentText
        data-testid="blockValue"
        size={textSize}
        style={{ color }}
        strong
      >
        {contentView || '-'}
      </ContentText>
    </InlineLoader>
  );
};
