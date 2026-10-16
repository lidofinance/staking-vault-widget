import { vaultTexts } from 'modules/vaults';
import { WarningMessage } from 'shared/components/warning-message';

export const PreSupplyWarning = () => {
  return (
    <WarningMessage data-testid={`createVault-confirmation-preSupplyWarning`}>
      {vaultTexts.actions.createVault.insufficientBalance}
    </WarningMessage>
  );
};
