import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { isAddressEqual, isAddress } from 'viem';

import { usePermissionsFormData } from './use-permissions-form-data';
import type { EditPermissionsSchema } from '../types';

const permissionsActionsTypes = ['grant', 'revoke'];

export const useAllowTransaction = () => {
  const { data: permissionsData } = usePermissionsFormData();
  const formFields = useWatch<EditPermissionsSchema>();

  return useMemo(() => {
    if (!permissionsData) {
      return false;
    }

    const { rolesSchema, noDepositor, noGuarantor } = formFields;

    if (!rolesSchema) {
      return false;
    }

    const { noDepositor: currentNODepositor, noGuarantor: currentNOGuarantor } =
      permissionsData;

    if (
      !noDepositor ||
      !noGuarantor ||
      !isAddress(noDepositor) ||
      !isAddress(noGuarantor)
    ) {
      return false;
    }

    const isDepositorChanged = !isAddressEqual(noDepositor, currentNODepositor);
    const isGuarantorChanged = !isAddressEqual(noGuarantor, currentNOGuarantor);
    const isPdgChanged = isDepositorChanged || isGuarantorChanged;
    const isPermissionsChanged = Object.entries(rolesSchema).some(([_, list]) =>
      list.some(
        (permission) =>
          !!permission?.action &&
          permissionsActionsTypes.includes(permission.action),
      ),
    );

    return isPdgChanged || isPermissionsChanged;
  }, [formFields, permissionsData]);
};
