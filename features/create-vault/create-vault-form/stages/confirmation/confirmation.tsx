import { useDappStatus } from 'modules/web3';

import { MAIN_SETTINGS } from 'features/create-vault/consts';
import { ConfirmationAction } from './confirmation-action';
import { ConfirmationEntry } from './confirmation-entry';
import { CreateVaultCost } from './create-vaut-cost';
import { PreSupplyWarning } from './pre-suply-warning';
import { useSupplyBalance } from './use-supply-balance';

import {
  ConfirmInfoTitle,
  List,
  ListItemCompact,
  ConfirmationLabel,
  SectionContainer,
  TextBold,
  TextError,
} from './styles';

type ConfirmationProps = {
  isShown: boolean;
};

export const Confirmation = ({ isShown }: ConfirmationProps) => {
  const { isWalletConnected } = useDappStatus();
  const { hasEnoughETH, isLoading } = useSupplyBalance();
  const showWarning = isWalletConnected && !isLoading && !hasEnoughETH;

  const PreSupplyAmountComponent = showWarning ? TextError : TextBold;

  return (
    <SectionContainer isShown={isShown}>
      <List>
        <ConfirmInfoTitle>{'Main settings'}</ConfirmInfoTitle>
        {MAIN_SETTINGS.map((item) => {
          return (
            <ConfirmationEntry
              {...item}
              key={item.name}
              dataTestId={`createVault-confirmation-${item.name}`}
            />
          );
        })}
        <ListItemCompact>
          <ConfirmationLabel
            data-testid={`createVault-confirmation-initialSupply-label`}
          >
            Initial supply to stVault
          </ConfirmationLabel>
          <PreSupplyAmountComponent
            data-testid={`createVault-confirmation-initialSupply-value`}
          >
            1 ETH
          </PreSupplyAmountComponent>
        </ListItemCompact>
        <CreateVaultCost />
      </List>
      {showWarning && <PreSupplyWarning />}
      <ConfirmationAction
        isConnected={isWalletConnected}
        isDisabled={!hasEnoughETH}
      />
    </SectionContainer>
  );
};
