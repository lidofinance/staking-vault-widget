import type { FC } from 'react';
import { useBreakpoint, Address } from '@lidofinance/lido-ui';

import { ROLES_TO_CONTRACT_CONSTANT } from 'modules/vaults';

import type { CustodyRoleMembers } from '../../types';

import {
  RoleAddressesListContainer,
  RoleGroup,
  RoleLabel,
  AddressesList,
  ListItem,
} from './styles';

type RoleAddressesListProps = {
  entries: CustodyRoleMembers[];
  testIdPrefix: string;
};

export const RoleAddressesList: FC<RoleAddressesListProps> = ({
  entries,
  testIdPrefix,
}) => {
  const isMobile = useBreakpoint('md');
  const symbols = isMobile ? 16 : 22;

  return (
    <RoleAddressesListContainer>
      {entries.map(({ role, addresses }) => (
        <RoleGroup key={role}>
          <RoleLabel
            data-testid={`additionalVerification-${testIdPrefix}-roleLabel`}
          >
            {ROLES_TO_CONTRACT_CONSTANT[role]}:
          </RoleLabel>
          <AddressesList>
            {addresses.map((address) => (
              <ListItem
                key={address}
                data-testid={`additionalVerification-${testIdPrefix}-roleAddress`}
              >
                <Address
                  style={{ fontWeight: 'bold' }}
                  symbols={symbols}
                  address={address.toLowerCase()}
                />
              </ListItem>
            ))}
          </AddressesList>
        </RoleGroup>
      ))}
    </RoleAddressesListContainer>
  );
};
