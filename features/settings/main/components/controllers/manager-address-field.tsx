import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { useFieldArray, useFormState } from 'react-hook-form';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';
import { Hint } from 'shared/components';

import { Skeleton } from 'features/settings/main/styles';
import { EditPropertyAddress } from './edit-property-address';
import { DisplayAddress } from './display-address';
import { GroupWrapper } from './styles';

import {
  MainSettingsFormValidatedValues,
  MainSettingsOverview,
  ManagersKeys,
} from 'features/settings/main/types';

type InputResolverProps = Omit<MainSettingsOverview, 'name'> & {
  name: ManagersKeys;
};

export const ManagerAddressField: FC<InputResolverProps> = ({
  editLabel,
  name,
  title,
  hint,
  canEditRole,
}) => {
  const { disabled, isLoading } = useFormState();
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const { fields, append, remove, update } =
    useFieldArray<MainSettingsFormValidatedValues>({ name });

  const isEditable =
    !disabled && ((isConfirmingRoles && hasConfirmingRole) || hasPermission);

  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
        <Hint text={hint} />
      </Text>
      {isLoading && <Skeleton />}
      <DisplayAddress
        isEditable={isEditable}
        fields={fields}
        remove={remove}
        update={update}
      />
      {isEditable && (
        <EditPropertyAddress
          editLabel={editLabel}
          name={name as ManagersKeys}
          fields={fields}
          append={append}
        />
      )}
    </GroupWrapper>
  );
};
