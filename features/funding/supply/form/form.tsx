import { SupplyFormProvider } from './supply-form-provider';

import { Suppliable } from './suppliable';
import { SupplyFormInputs } from './supply-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';
import { WarningBanners, ErrorBanners } from './content';

export const SupplyForm = () => {
  return (
    <SupplyFormProvider>
      <ErrorBanners />
      <Suppliable />
      <SupplyFormInputs />
      <WarningBanners />
      <SubmitButton />
      <TxInfo />
    </SupplyFormProvider>
  );
};
