import { FC } from 'react';
import { InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ContentText } from './styles';

export interface ItemValueProps {
  content: string | number | undefined | boolean;
  isLoading?: boolean;
  color?: string;
  textSize?: 'lg' | 'xl';
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color, textSize = 'xl' } = props;

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <div>
          <ContentText size={textSize} style={{ color }} strong>
            {content || '-'}
          </ContentText>
        </div>
      )}
    </>
  );
};
