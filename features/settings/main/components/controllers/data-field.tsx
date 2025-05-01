import { FC } from 'react';
import { ReadonlyInput } from './readonly-input';
import { GroupWrapper } from './styles';

import type { MainSettingsOverview } from 'features/settings/main/types';
import { EditProperty } from './edit-property';
import { Text } from '@lidofinance/lido-ui';
import {
  useVaultConfirmingRoles,
  useVaultPermission,
} from 'modules/vaults/hooks/use-vault-permissions';

type InputResolverProps = MainSettingsOverview;

export const DataField: FC<InputResolverProps> = ({
  label,
  editLabel,
  name,
  title,
  actionText = 'Initiate a change',
  vaultKey,
  canEditRole,
}) => {
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable = hasConfirmingRole || hasPermission;
  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      <ReadonlyInput label={label} vaultKey={vaultKey} />
      {isEditable && (
        <EditProperty
          editLabel={editLabel}
          name={name}
          actionText={actionText}
        />
      )}
    </GroupWrapper>
  );
};
