import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { DisplayAddress } from './display-address';

import {
  MainSettingsOverview,
  ManagersKeys,
} from 'features/settings/main/types';
import { EditPropertyAddress } from './edit-property-address';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';
import { Hint } from 'shared/components';

import { GroupWrapper } from './styles';

type InputResolverProps = MainSettingsOverview;

export const DataManagerField: FC<InputResolverProps> = ({
  editLabel,
  name,
  title,
  vaultKey,
  hint,
  canEditRole,
}) => {
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable = (isConfirmingRoles && hasConfirmingRole) || hasPermission;
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
