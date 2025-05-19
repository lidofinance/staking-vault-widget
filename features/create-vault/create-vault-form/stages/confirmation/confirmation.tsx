import { useDappStatus } from 'modules/web3';

import { Hint } from 'features/create-vault/shared/hint';
import { MAIN_SETTINGS } from 'features/create-vault/consts';
import { ConfirmationAction } from './confirmation-action';
import { ConfirmationData } from './confirmation-data';
import { CreateVaultCost } from './create-vaut-cost';
import { PreSupplyWarning } from './pre-suply-warning';
import { useSupplyBalance } from './use-supply-balance';

import {
  ConfirmInfoTitle,
  List,
  ListItem,
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
            <ListItem key={item.name}>
              <ConfirmationLabel>
                {item.title} <Hint hint={item.hint} />
              </ConfirmationLabel>
              <ConfirmationData name={item.name} dataType={item.dataType} />
            </ListItem>
          );
        })}
        <ListItemCompact>
          <ConfirmationLabel>Initial supply to stVault</ConfirmationLabel>
          <PreSupplyAmountComponent>1 ETH</PreSupplyAmountComponent>
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
