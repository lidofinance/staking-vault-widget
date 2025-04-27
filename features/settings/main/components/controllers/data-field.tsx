import { FC } from 'react';
import { ReadonlyInput } from './readonly-input';
import { DisplayAddress } from './display-address';
import { GroupWrapper } from './styles';

import type { MainSettingsOverview } from 'features/settings/main/types';
import { EditProperty } from './edit-property';
import { EditPropertyAddress } from './edit-property-address';
import { Text } from '@lidofinance/lido-ui';
import {
  useVaultConfirmingRoles,
  useVaultPermissions,
} from 'modules/vaults/hooks/use-vault-permissions';

type InputResolverProps = MainSettingsOverview;

export const DataField: FC<InputResolverProps> = ({
  label,
  editLabel,
  name,
  dataType,
  title,
  actionText = 'Initiate a change',
  vaultKey,
  canEditRole,
}) => {
  const isTypeAddress = dataType === 'address';
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermissions(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable = hasConfirmingRole || hasPermission;
  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      {isTypeAddress && (
        <DisplayAddress
          isEditable={isEditable}
          name={name}
          vaultKey={vaultKey}
        />
      )}
      {!isTypeAddress && <ReadonlyInput label={label} vaultKey={vaultKey} />}
      {isEditable && isTypeAddress && (
        <EditPropertyAddress
          editLabel={editLabel}
          name={name}
          actionText={actionText}
        />
      )}
      {isEditable && !isTypeAddress && (
        <EditProperty
          editLabel={editLabel}
          name={name}
          actionText={actionText}
        />
      )}
    </GroupWrapper>
  );
};
