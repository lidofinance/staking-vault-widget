import { vaultTexts } from 'modules/vaults';

import {
  ConfirmationLabel,
  ConnectionDepositDescription,
  ConnectionDepositHeader,
  ConnectionDepositItem,
  TextBold,
  TextError,
} from './styles';

const texts = vaultTexts.actions.createVault.fields.connectionDeposit;

type ConnectionDepositRowProps = {
  isInsufficient: boolean;
};

export const ConnectionDepositRow = ({
  isInsufficient,
}: ConnectionDepositRowProps) => {
  const AmountComponent = isInsufficient ? TextError : TextBold;

  return (
    <ConnectionDepositItem data-testid="createVault-confirmation-connectionDeposit-listItem">
      <ConnectionDepositHeader>
        <ConfirmationLabel data-testid="createVault-confirmation-connectionDeposit-label">
          {texts.title}
        </ConfirmationLabel>
        <AmountComponent data-testid="createVault-confirmation-connectionDeposit-value">
          1 ETH
        </AmountComponent>
      </ConnectionDepositHeader>
      <ConnectionDepositDescription>
        {texts.description}
      </ConnectionDepositDescription>
    </ConnectionDepositItem>
  );
};
