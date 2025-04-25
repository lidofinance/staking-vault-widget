import { Address, isAddress } from 'viem';
import { Resolver, UseFormGetValues } from 'react-hook-form';
import {
  PermissionKeys,
  VaultPermissions,
} from 'features/settings/permissions/types';
import { isValidEns } from 'utils/ens';

export const validatePermissions = (
  getValues: UseFormGetValues<Record<string, any>>,
): Resolver<VaultPermissions> => {
  return async (values: VaultPermissions) => {
    const errors = {} as Record<
      PermissionKeys,
      Record<number, { value: string }>
    >;
    const keysList = Object.keys(values) as PermissionKeys[];

    await Promise.all(
      keysList.map(async (key: PermissionKeys) => {
        const payload = values[key];
        errors[key] = {};

        await Promise.all(
          payload.map(async (field, index) => {
            const { value: currentValue } = field;

            if (!isAddress(currentValue)) {
              const isValid = isValidEns(currentValue);

              if (!isValid) {
                errors[key][`${index}`] = {
                  value: 'Invalid ethereum address',
                };
              }
            }

            const mainFormValues = (getValues(key) ?? []) as Address[];
            const filtered = mainFormValues.filter(
              (value) => value === currentValue,
            );

            if (filtered.length > 0) {
              errors[key][index] = {
                value: 'Address already added',
              };
            }
          }),
        );
      }),
    );

    return {
      values,
      errors,
    };
  };
};
