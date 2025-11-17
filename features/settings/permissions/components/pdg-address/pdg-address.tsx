import type { FC } from 'react';

import { useDappStatus } from 'modules/web3';
import { useVault } from 'modules/vaults';

import { IconDecorator } from './icon-decorator';
import { PDGAddressReadonly } from './pdg-address-readonly';
import { PGDRolesKeys } from 'features/settings/permissions/types';
import { PDGAddressInput, Wrapper } from './styles';
import { useIsNewAddress } from './hooks';

export type AddressBlockProps = {
  permissionFormField: PGDRolesKeys;
  readonly?: boolean;
  dataTestId: string;
};

export const PDGAddress: FC<AddressBlockProps> = ({
  permissionFormField,
  dataTestId,
}) => {
  const { address } = useDappStatus();
  const { activeVault } = useVault();
  const { isNewAddress } = useIsNewAddress(permissionFormField);

  if (activeVault?.nodeOperator !== address) {
    return <PDGAddressReadonly formFieldName={permissionFormField} />;
  }

  return (
    <Wrapper data-testid={`${dataTestId}-addressesWrapper`}>
      <PDGAddressInput
        $isNewAddress={isNewAddress}
        leftDecorator={<IconDecorator formFieldName={permissionFormField} />}
        fieldName={permissionFormField}
        variant="small"
        showRightDecorator={false}
      />
    </Wrapper>
  );
};
