import { WarningMessage } from 'shared/components/warning-message';

export const PreSupplyWarning = () => {
  return (
    <WarningMessage data-testid={`createVault-confirmation-preSupplyWarning`}>
      To create a new Vault, you need to supply 1 ETH. Your current balance is
      insufficient. Please add funds to your wallet and try again.
    </WarningMessage>
  );
};
