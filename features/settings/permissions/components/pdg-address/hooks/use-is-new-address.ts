import { useController, useFormState, useWatch } from 'react-hook-form';
import { isAddress, isAddressEqual, type Address } from 'viem';

import type {
  EditPermissionsSchema,
  PGDRolesKeys,
} from 'features/settings/permissions/types';

export const useIsNewAddress = (name: PGDRolesKeys) => {
  const { defaultValues } = useFormState<EditPermissionsSchema>({ name });

  const {
    fieldState: { invalid },
  } = useController<EditPermissionsSchema, PGDRolesKeys>({ name });

  const fieldValue = useWatch<EditPermissionsSchema, PGDRolesKeys>({ name });
  const defaultFieldValue: Address | undefined = defaultValues?.[name];

  const isNewAddress =
    !invalid &&
    !!fieldValue &&
    !!defaultFieldValue &&
    isAddress(fieldValue) &&
    isAddress(defaultFieldValue) &&
    !isAddressEqual(fieldValue, defaultFieldValue);

  return {
    isNewAddress,
    invalid,
    fieldValue,
    defaultFieldValue,
  };
};
