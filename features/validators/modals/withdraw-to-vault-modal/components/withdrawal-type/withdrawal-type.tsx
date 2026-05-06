import { type FC, useCallback } from 'react';

import { SwitcherItemStyled, SwitcherStyled } from './styles';

export type WithdrawalVariant = 'partial' | 'full';

type WithdrawalTypeProps = {
  value: WithdrawalVariant;
  onChange: (value: WithdrawalVariant) => void;
};

export const WithdrawalType: FC<WithdrawalTypeProps> = ({
  value,
  onChange,
}) => {
  const isFull = value === 'full';

  const openPartialWithdrawal = useCallback(() => {
    onChange('partial');
  }, [onChange]);

  const openFullWithdrawal = useCallback(() => {
    onChange('full');
  }, [onChange]);

  return (
    <SwitcherStyled data-testid="switcher">
      <SwitcherItemStyled
        active={!isFull}
        onClick={openPartialWithdrawal}
        data-testid="type-partial"
      >
        Partial withdrawal
      </SwitcherItemStyled>
      <SwitcherItemStyled
        active={isFull}
        onClick={openFullWithdrawal}
        data-testid="type-full"
      >
        Full withdrawal
      </SwitcherItemStyled>
    </SwitcherStyled>
  );
};
