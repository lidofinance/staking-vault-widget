import {
  FC,
  PropsWithChildren,
  useMemo,
  createContext,
  useContext,
} from 'react';

import { RadioFormData } from 'features/settings/main/components/controllers/radio-selector';

const MOCK_DATA = {
  someValueData: [
    {
      value: 10000n,
      type: 'Current',
      expiry: 567888821321n,
    },
    {
      value: 1000n,
      type: 'External',
      expiry: 1000n,
    },
    {
      value: 156n,
      type: 'Internal',
      expiry: 56788882132n,
    },
  ],
};

export type DataContextValue = {
  someField: RadioFormData[];
};

const DataContext = createContext<DataContextValue | null>(null);
DataContext.displayName = 'DataContext';

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const values: DataContextValue | null = useMemo(() => {
    const current = MOCK_DATA.someValueData.find(
      (item) => item.type === 'Current',
    );
    if (!current) return null;

    // Current values for voting
    const someField: RadioFormData[] = [];

    MOCK_DATA.someValueData.map((item) => {
      const expiry = new Date(
        new Date().getTime() + Number(item.expiry),
      ).toLocaleString('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      someField.push({
        value: String(item.value),
        tags: [`${String(expiry)}`, item.type],
        type: item.type,
        symbol: ' pokemons',
      });
    });

    // Custom values for voting
    someField.push({
      value: '',
      type: 'custom',
      tags: [],
      symbol: ' pokemons',
      placeholder: 'Propose new, pokemons',
    });

    return {
      someField,
    };
  }, []);

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
};
