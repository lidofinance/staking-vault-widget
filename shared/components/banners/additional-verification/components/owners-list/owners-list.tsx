import { type FC, useMemo } from 'react';
import { useBreakpoint, Address, Text } from '@lidofinance/lido-ui';
import { isAddressEqual, type Address as AddressType } from 'viem';

import { useDappStatus } from 'modules/web3';
import { vaultTexts } from 'modules/vaults/consts/texts';

import { OwnersListContainer, AddressesList, ListItem } from './styles';

type OwnersListProps = {
  ownersList: AddressType[];
};

const { ownersListTitle } =
  vaultTexts.actions.additionalVerification.banners.multipleOwners;

export const OwnersList: FC<OwnersListProps> = ({ ownersList }) => {
  const { address } = useDappStatus();
  const isMobile = useBreakpoint('md');
  const listWithoutConnectedAddress = useMemo(() => {
    if (!address) return [];

    return ownersList.filter((owner) => !isAddressEqual(owner, address));
  }, [ownersList, address]);
  const symbols = isMobile ? 16 : 22;

  return (
    <OwnersListContainer>
      <Text size="xxs">{ownersListTitle}</Text>
      <AddressesList>
        {listWithoutConnectedAddress.map((address) => (
          <ListItem
            key={address}
            data-testid="additionalVerification-multipleOwners-ownerAddress"
          >
            <Address
              style={{ fontWeight: 'bold' }}
              symbols={symbols}
              address={address.toLowerCase()}
            />
          </ListItem>
        ))}
      </AddressesList>
    </OwnersListContainer>
  );
};
