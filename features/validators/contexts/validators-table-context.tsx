import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';

import { CircleLoader } from 'shared/components';

import { useVaultValidatorsData, TablePlaceholder } from '../shared';

type ValidatorsTableContextValue = ReturnType<typeof useVaultValidatorsData>;

const ValidatorsTableContext =
  createContext<ValidatorsTableContextValue | null>(null);

export const useValidatorsTable = () => {
  const context = useContext(ValidatorsTableContext);

  invariant(
    context,
    '[useValidatorsTable] must be used within ValidatorsTableProvider',
  );

  return context;
};

export const ValidatorsTableProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const value = useVaultValidatorsData();

  // TODO: return to CircleLoader
  // showBy={!!value.validators}
  return (
    <ValidatorsTableContext.Provider value={value}>
      <CircleLoader
        isLoading={value.isLoading}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder />}
      >
        {children}
      </CircleLoader>
    </ValidatorsTableContext.Provider>
  );
};
