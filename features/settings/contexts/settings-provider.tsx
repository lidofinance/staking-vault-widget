import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react';
import invariant from 'tiny-invariant';
import { SettingsPaths, SETTINGS_PATHS } from 'features/settings/const';

export type SettingsContextValue = {
  isMainTab: boolean;
  setSettingsFormMode: (mode: SettingsPaths) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);
SettingsContext.displayName = 'SettingsProvider';

export const useSettings = () => {
  const value = useContext(SettingsContext);
  invariant(value, 'useSettings was used outside SettingsContext');
  return value;
};

export const SettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<SettingsPaths>(() => SETTINGS_PATHS.main);
  const isMainTab = mode === SETTINGS_PATHS.main;

  const setSettingsFormMode = useCallback((mode: SettingsPaths) => {
    setMode(mode);
  }, []);

  const value = useMemo(
    () => ({
      isMainTab,
      setSettingsFormMode,
    }),
    [isMainTab, setSettingsFormMode],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
