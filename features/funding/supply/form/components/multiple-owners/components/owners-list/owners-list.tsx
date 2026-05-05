import { type FC, useMemo } from 'react';
import { Text, useBreakpoint } from '@lidofinance/lido-ui';
import { type Address, isAddressEqual } from 'viem';

import { useDappStatus } from 'modules/web3';
import { vaultTexts } from 'modules/vaults';

import { AddressesList, AddressStyled, Container, ListItem } from './styles';

type OwnersListProps = {
  ownersList: Address[];
};

const { ownersListTitle } = vaultTexts.actions.antiScam.banners.multipleOwners;

export const OwnersList: FC<OwnersListProps> = ({ ownersList }) => {
  const { address } = useDappStatus();
  const isMobile = useBreakpoint('md');
  const listWithoutConnectedAddress = useMemo(() => {
    if (!address) return [];
    return ownersList.filter((owner) => !isAddressEqual(owner, address));
  }, [ownersList, address]);
  const symbols = isMobile ? 16 : 22;

  return (
    <Container>
      <Text size="xxs">{ownersListTitle}</Text>
      <AddressesList>
        {listWithoutConnectedAddress.map((address) => (
          <ListItem key={address}>
            <AddressStyled symbols={symbols} address={address} />
          </ListItem>
        ))}
      </AddressesList>
    </Container>
  );
};
