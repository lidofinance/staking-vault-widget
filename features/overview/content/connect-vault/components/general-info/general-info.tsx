import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { useTierRequest } from 'features/overview/hooks';

import { GeneralInfoContainer, List, ListItem, ListWrapper } from './styles';

const { description, listTitle } = vaultTexts.metrics.connectVault;

export const GeneralInfo = () => {
  const { proposedTier } = useTierRequest();

  return (
    <GeneralInfoContainer>
      <Text size="xs">{description}</Text>
      <ListWrapper>
        <Text size="xs">{listTitle}</Text>
        <List>
          <ListItem>
            <Text size="xs">Approve connection to Lido VaultHub</Text>
          </ListItem>
          <ListItem>
            <Text size="xs">
              Enable {proposedTier ? proposedTier.tierName : 'Default Tier'}{' '}
              terms and fees
            </Text>
          </ListItem>
          <ListItem>
            <Text size="xs">
              Supply 1 ETH as collateral (refundable if disconnected from Lido
              VaultHub)
            </Text>
          </ListItem>
        </List>
      </ListWrapper>
    </GeneralInfoContainer>
  );
};
