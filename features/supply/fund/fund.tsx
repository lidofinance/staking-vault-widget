import { FundForm } from './form';
import { FundFormProvider } from './fund-form-context';

export const Fund = () => {
  return (
    <FundFormProvider>
      <FundForm />
    </FundFormProvider>
  );
};
