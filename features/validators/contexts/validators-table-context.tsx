import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';

import { useVaultValidatorsData } from '../shared';

type ValidatorsTableContextValue = ReturnType<typeof useVaultValidatorsData>;

const ValidatorsTableContext =
  createContext<ValidatorsTableContextValue | null>(null);

export const useValidators = () => {
  const context = useContext(ValidatorsTableContext);

  invariant(
    context,
    '[useValidators] must be used within ValidatorsTableProvider',
  );

  return context;
};

export const ValidatorsTableProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useVaultValidatorsData();

  return (
    <ValidatorsTableContext.Provider value={value}>
      {children}
    </ValidatorsTableContext.Provider>
  );
};
