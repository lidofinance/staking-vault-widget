import {
  FC,
  PropsWithChildren,
  useState,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';

import invariant from 'tiny-invariant';

import {
  ToggleValue,
  PermissionToggleEnum,
} from 'features/settings/permissions/consts';
import { PermissionsSettingsContextValue } from 'features/settings/permissions/types';
import { useVaultPermissionsRoles } from 'features/settings/permissions/hooks';

const PermissionsDataContext =
  createContext<PermissionsSettingsContextValue | null>(null);
PermissionsDataContext.displayName = 'PermissionsDataContext';

export const usePermissionsData = () => {
  const value = useContext(PermissionsDataContext);
  invariant(
    value,
    'usePermissionsData was used outside the PermissionsDataContext provider',
  );

  return value;
};

export const PermissionsDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [permissionsView, setPermissionsView] = useState<ToggleValue>(
    () => PermissionToggleEnum.byPermission,
  );

  const handleSetPermissionsView = useCallback((value: ToggleValue) => {
    setPermissionsView(value);
  }, []);

  // TODO: check data after Hoodi migration
  const { data } = useVaultPermissionsRoles();

  const editPermissionsData = useMemo(
    () => ({
      permissionsView,
      handleSetPermissionsView,
      rolesList: data,
    }),
    [permissionsView, handleSetPermissionsView, data],
  );

  return (
    <PermissionsDataContext.Provider value={editPermissionsData}>
      {children}
    </PermissionsDataContext.Provider>
  );
};
