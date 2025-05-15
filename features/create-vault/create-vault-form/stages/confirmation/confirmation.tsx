import { MAIN_SETTINGS } from 'features/create-vault/consts';
import { ConfirmationAction } from './confirmation-action';
import { SectionContainer } from '../../styles';
import { ConfirmationData } from './confirmation-data';
import {
  ConfirmInfoTitle,
  List,
  ListItem,
  ListItemCompact,
  PermissionTitle,
} from './styles';
import {
  TextBold,
  TextError,
} from './confirmation-data/confirmation-data-item/styles';
import { CreateVaultCost } from './create-vaut-cost';
import { PreSupplyWarning } from './pre-suply-warning';
import { useSupplyBalance } from './use-supply-balance';
import { useDappStatus } from 'modules/web3';

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
      <ConfirmInfoTitle>{'Main settings'}</ConfirmInfoTitle>
      <List>
        {MAIN_SETTINGS.map((item) => {
          return (
            <ListItem key={item.name}>
              <PermissionTitle>{item.title}</PermissionTitle>
              <ConfirmationData name={item.name} dataType={item.dataType} />
            </ListItem>
          );
        })}
        <ListItemCompact>
          <PermissionTitle>Initial supply to stVault</PermissionTitle>
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
