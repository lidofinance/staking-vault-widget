import { type FC, useMemo } from 'react';
import { useBreakpoint, Address, Text } from '@lidofinance/lido-ui';
import { isAddressEqual, type Address as AddressType } from 'viem';

import { useDappStatus } from 'modules/web3';

import { OwnersListContainer, AddressesList, ListItem } from './styles';

type OwnersListProps = {
  ownersList: AddressType[];
  title: string;
  testIdPrefix: string;
};

export const OwnersList: FC<OwnersListProps> = ({
  ownersList,
  title,
  testIdPrefix,
}) => {
  const { address } = useDappStatus();
  const isMobile = useBreakpoint('md');
  const listWithoutConnectedAddress = useMemo(() => {
    if (!address) return [];

    return ownersList.filter((owner) => !isAddressEqual(owner, address));
  }, [ownersList, address]);
  const symbols = isMobile ? 16 : 22;

  return (
    <OwnersListContainer>
      <Text size="xxs">{title}</Text>
      <AddressesList>
        {listWithoutConnectedAddress.map((address) => (
          <ListItem
            key={address}
            data-testid={`additionalVerification-${testIdPrefix}-ownerAddress`}
          >
            <Address
              style={{ fontWeight: 'bold' }}
              symbols={symbols}
              address={address}
            />
          </ListItem>
        ))}
      </AddressesList>
    </OwnersListContainer>
  );
};
