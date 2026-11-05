import { useDappStatus } from 'modules/web3';

import { CONFIRM_ENTRIES } from 'features/create-vault/consts';
import { AcceptTerms } from './accept-terms';
import { ConfirmationAction } from './confirmation-action';
import { ConfirmationEntry } from './confirmation-entry';
import { ConnectionDepositRow } from './connection-deposit-row';
import { PreSupplyWarning } from './pre-supply-warning';
import { useSupplyBalance } from './use-supply-balance';

import { List, SectionContainer } from './styles';

type ConfirmationProps = {
  isShown: boolean;
};

export const Confirmation = ({ isShown }: ConfirmationProps) => {
  const { isWalletConnected } = useDappStatus();
  const { hasEnoughETH, isLoading } = useSupplyBalance();
  const showWarning = isWalletConnected && !isLoading && !hasEnoughETH;

  if (!isShown) return null;

  return (
    <SectionContainer isShown={isShown}>
      <List>
        {CONFIRM_ENTRIES.map((item) => {
          return (
            <ConfirmationEntry
              {...item}
              key={item.name}
              dataTestId={`createVault-confirmation-${item.name}`}
            />
          );
        })}
        <ConnectionDepositRow isInsufficient={showWarning} />
      </List>
      <AcceptTerms />
      {showWarning && <PreSupplyWarning />}
      <ConfirmationAction
        isConnected={isWalletConnected}
        isDisabled={!hasEnoughETH}
      />
    </SectionContainer>
  );
};
