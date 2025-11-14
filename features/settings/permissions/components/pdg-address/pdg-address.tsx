import type { FC } from 'react';

import { useDappStatus } from 'modules/web3';
import { useVault } from 'modules/vaults';
import { AddressInputHookForm } from 'shared/hook-form/controls';

import { IconDecorator } from './icon-decorator';
import { PDGAddressReadonly } from './pdg-address-readonly';
import type { PGDRolesKeys } from 'features/settings/permissions/types';
import { Wrapper } from './styles';

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

  if (activeVault?.nodeOperator !== address) {
    return <PDGAddressReadonly formFieldName={permissionFormField} />;
  }

  return (
    <Wrapper data-testid={`${dataTestId}-addressesWrapper`}>
      <AddressInputHookForm
        leftDecorator={<IconDecorator formFieldName={permissionFormField} />}
        fieldName={permissionFormField}
        variant="small"
        showRightDecorator={false}
      />
    </Wrapper>
  );
};
