import type { FC } from 'react';

import { HintContainer, HintText } from './styles';

export const OffBookDepositsHint: FC = () => {
  return (
    <HintContainer data-testid="off-book-deposits-hint">
      <HintText size="xxs">
        <strong>Off-Book Deposits</strong> are validator deposits not yet
        included in Total Value. This includes deposits made via the PDG
        Shortcut flow (unguaranteed deposits), and initial deposits made
        directly to a validator outside of the stVault.
      </HintText>
      <HintText size="xxs">
        <strong>Consolidations</strong> are not shown here — they are not
        visible to the oracle while in progress, and will appear in Total Value
        once the transferred balance arrives on the target validator.
      </HintText>
    </HintContainer>
  );
};
