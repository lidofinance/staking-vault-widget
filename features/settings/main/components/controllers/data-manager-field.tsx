import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { useFormState } from 'react-hook-form';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';
import { Hint } from 'shared/components';

import { EditPropertyAddress } from './edit-property-address';
import { DisplayAddress } from './display-address';
import { GroupWrapper } from './styles';

import type {
  MainSettingsOverview,
  ManagersKeys,
} from 'features/settings/main/types';

type InputResolverProps = MainSettingsOverview;

export const DataManagerField: FC<InputResolverProps> = ({
  editLabel,
  name,
  title,
  vaultKey,
  hint,
  canEditRole,
}) => {
  const { disabled } = useFormState();
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable =
    !disabled && ((isConfirmingRoles && hasConfirmingRole) || hasPermission);

  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
        <Hint text={hint} />
      </Text>
      <DisplayAddress isEditable={isEditable} vaultKey={vaultKey} />
      {isEditable && (
        <EditPropertyAddress
          editLabel={editLabel}
          name={name as ManagersKeys}
        />
      )}
    </GroupWrapper>
  );
};
