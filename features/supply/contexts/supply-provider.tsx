import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';

export interface SupplyContextProps {
  mode: 'fund' | 'withdraw';
}

export type SupplyContextValue = {
  isFundTab: boolean;
};

const SupplyContext = createContext<SupplyContextValue | null>(null);
SupplyContext.displayName = 'SupplyProvider';

export const useSupply = () => {
  const value = useContext(SupplyContext);
  invariant(value, 'useSupply was used outside SupplyContext');
  return value;
};

export const SupplyProvider: FC<PropsWithChildren<SupplyContextProps>> = ({
  children,
  mode,
}) => {
  const isFundTab = mode === 'fund';

  const value = useMemo(
    () => ({
      isFundTab,
    }),
    [isFundTab],
  );

  return (
    <SupplyContext.Provider value={value}>{children}</SupplyContext.Provider>
  );
};
