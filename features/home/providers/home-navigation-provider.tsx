import React, {
  useState,
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useCallback,
  FC,
  PropsWithChildren,
} from 'react';
import invariant from 'tiny-invariant';
import { HomeNavigationMode } from 'features/home/types';

interface HomeNavigationContextValue {
  viewMode: HomeNavigationMode;
  switchViewMode: (mode: HomeNavigationMode) => void;
}

const HomeNavigationContext = createContext<HomeNavigationContextValue | null>(
  null,
);
HomeNavigationContext.displayName = 'HomeNavigationContext';

interface HomeNavigationProviderProps {
  children: ReactNode;
  initialMode?: HomeNavigationMode;
}

export const HomeNavigationProvider: FC<
  PropsWithChildren<HomeNavigationProviderProps>
> = ({ children, initialMode = 'full' }) => {
  const [viewMode, setViewMode] = useState<HomeNavigationMode>(initialMode);

  const switchViewMode = useCallback((mode: HomeNavigationMode) => {
    setViewMode(mode);
  }, []);

  const contextValue = useMemo(
    () => ({
      viewMode,
      switchViewMode,
    }),
    [viewMode, switchViewMode],
  );

  return (
    <HomeNavigationContext.Provider value={contextValue}>
      {children}
    </HomeNavigationContext.Provider>
  );
};

export const useHomeNavigationMode = (): HomeNavigationContextValue => {
  const context = useContext(HomeNavigationContext);
  invariant(
    context,
    'useTableViewMode must be used within HomeNavigationProvider',
  );

  return context;
};
