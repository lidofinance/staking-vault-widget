import type { FC } from 'react';
import { useWatch } from 'react-hook-form';

import { AddressBadge } from 'shared/components';

import {
  EditPermissionsSchema,
  PGDRolesKeys,
} from 'features/settings/permissions/types';

type ReadonlyModeProps = {
  formFieldName: PGDRolesKeys;
};

export const PDGAddressReadonly: FC<ReadonlyModeProps> = ({
  formFieldName,
}) => {
  const fieldData = useWatch<EditPermissionsSchema, PGDRolesKeys>({
    name: formFieldName,
  });
  return <AddressBadge symbols={10} address={fieldData} showPopover />;
};
