import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';

export interface AdjustmentContextProps {
  mode: 'mint' | 'repay';
}

export type SupplyContextValue = {
  isMintTab: boolean;
};

const AdjustmentContext = createContext<SupplyContextValue | null>(null);
AdjustmentContext.displayName = 'AdjustmentProvider';

export const useAdjustment = () => {
  const value = useContext(AdjustmentContext);
  invariant(value, 'useAdjustment was used outside AdjustmentProvider');
  return value;
};

export const AdjustmentProvider: FC<
  PropsWithChildren<AdjustmentContextProps>
> = ({ children, mode }) => {
  const isMintTab = mode === 'mint';

  const value = useMemo(
    () => ({
      isMintTab,
    }),
    [isMintTab],
  );

  return (
    <AdjustmentContext.Provider value={value}>
      {children}
    </AdjustmentContext.Provider>
  );
};
