import type { FC } from 'react';

import { FormatToken } from 'shared/formatters';

import { WarningInfo } from 'features/validators/shared';

type ObligationExistsProps = {
  obligationsShortfallValue: bigint;
};

export const ObligationExists: FC<ObligationExistsProps> = ({
  obligationsShortfallValue,
}) => {
  if (obligationsShortfallValue === 0n) {
    return null;
  }

  return (
    <WarningInfo>
      Repay obligations before withdrawal{' '}
      <FormatToken amount={obligationsShortfallValue} symbol="ETH" />
    </WarningInfo>
  );
};
