import { DataProvider } from './context/data-provider';
import { DataFormProvider } from './context/data-form-provider';

import { RadioForm } from './radio-form';

export const NewForm = () => {
  return (
    <DataProvider>
      <DataFormProvider>
        <RadioForm />
      </DataFormProvider>
    </DataProvider>
  );
};
