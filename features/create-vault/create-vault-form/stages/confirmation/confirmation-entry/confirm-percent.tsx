import { FC } from 'react';
import invariant from 'tiny-invariant';

import { isNumber } from 'utils';

import { TextBold } from './styles';

import type { ConfirmDataItemProps } from './types';

export const ConfirmPercent: FC<ConfirmDataItemProps> = ({
  payload,
  dataTestId,
}) => {
  if (!payload) return null;

  invariant(
    isNumber(payload) || typeof payload === 'string',
    'Payload must be a string | number',
  );
  return (
    <TextBold data-testid={dataTestId ? `${dataTestId}-text` : undefined}>
      {payload}%
    </TextBold>
  );
};
