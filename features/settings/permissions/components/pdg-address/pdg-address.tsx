import type { FC } from 'react';

import { useDappStatus } from 'modules/web3';
import { AddressInputHookForm } from 'shared/hook-form/controls';

import { usePermissionsFormData } from 'features/settings/permissions/hooks';
import { PGDRolesKeys } from 'features/settings/permissions/types';
import { IconDecorator } from './icon-decorator';
import { PDGAddressReadonly } from './pdg-address-readonly';
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
  const { data } = usePermissionsFormData();

  if (data?.[permissionFormField] !== address) {
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
