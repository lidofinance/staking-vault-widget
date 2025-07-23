import { FC } from 'react';
import { InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ContentText } from './styles';

export interface ItemValueProps {
  content: string | number | undefined | boolean | bigint;
  isLoading?: boolean;
  color?: string;
  textSize?: 'lg' | 'xl';
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color, textSize = 'xl' } = props;
  const contentView =
    typeof content === 'bigint' ? content.toString() : content;

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
