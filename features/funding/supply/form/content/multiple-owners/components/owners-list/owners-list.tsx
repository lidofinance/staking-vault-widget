import { Text, useBreakpoint } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { AddressesList, AddressStyled, Container, ListItem } from './styles';

const { ownersListTitle } = vaultTexts.actions.supply.banners.multipleOwners;

export const OwnersList = () => {
  const isMobile = useBreakpoint('md');
  const symbols = isMobile ? 16 : 22;

  return (
    <Container>
      <Text size="xxs">{ownersListTitle}</Text>
      <AddressesList>
        <ListItem>
          <AddressStyled
            symbols={symbols}
            address="0x9cf9B70E9Ba7F4D2A277533e925546B4469e6f79"
          />
        </ListItem>
      </AddressesList>
    </Container>
  );
};
