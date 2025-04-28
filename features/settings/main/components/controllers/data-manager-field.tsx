import { FC } from 'react';
import { DisplayAddress } from './display-address';
import { GroupWrapper } from './styles';

import {
  MainSettingsOverview,
  ManagersKeys,
} from 'features/settings/main/types';
import { EditPropertyAddress } from './edit-property-address';
import { Text } from '@lidofinance/lido-ui';
import {
  useVaultConfirmingRoles,
  useVaultPermission,
} from 'modules/vaults/hooks/use-vault-permissions';

type InputResolverProps = MainSettingsOverview;

export const DataManagerField: FC<InputResolverProps> = ({
  editLabel,
  name,
  title,
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
