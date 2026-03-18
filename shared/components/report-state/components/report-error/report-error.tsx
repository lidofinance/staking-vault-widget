import type { FC } from 'react';

import { DATA_UNAVAILABLE } from 'consts/text';

import { TextContent } from '../../shared';

type ReportErrorType = {
  error: Error | null;
};

export const ReportError: FC<ReportErrorType> = ({ error }) => {
  if (!error) return null;

  return <TextContent>{DATA_UNAVAILABLE}</TextContent>;
};
