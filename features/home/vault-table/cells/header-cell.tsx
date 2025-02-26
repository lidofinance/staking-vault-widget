import { FC } from 'react';

import { Question } from '@lidofinance/lido-ui';
import { CommonHeader } from 'features/home/vault-table/styles';

export interface HeaderCellProps {
  title: string;
  showQuestion?: boolean;
}

export const HeaderCell: FC<HeaderCellProps> = (props) => {
  const { title, showQuestion = true } = props;
  return (
    <CommonHeader>
      {title}
      {showQuestion && <Question />}
    </CommonHeader>
  );
};
