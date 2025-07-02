import {
  FC,
  PropsWithChildren,
  useMemo,
  createContext,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';

import type { MainSettingsDataContextValue } from '../types';
import { useVaultSettingsData } from '../hooks';
import { useDappStatus } from 'modules/web3';

const MainSettingsDataContext =
  createContext<MainSettingsDataContextValue | null>(null);
MainSettingsDataContext.displayName = 'MainSettingsDataContext';

export const useMainSettingsFormData = () => {
  const context = useContext(MainSettingsDataContext);
  invariant(context, '[useMainSettingsData] context is not defined');
  return context;
};

export const MainSettingsFormDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { address } = useDappStatus();
  const query = useVaultSettingsData();

  // TODO: remove address dependency and move logic to render
  // extra dep check because address is part of query.select
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const contextValue = useMemo(() => query, [query.data, address]);

  return (
    <MainSettingsDataContext.Provider value={contextValue}>
      {children}
    </MainSettingsDataContext.Provider>
  );
};
