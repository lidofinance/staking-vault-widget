import { SupplyFormProvider } from './supply-form-provider';

import { Suppliable } from './suppliable';
import { SupplyFormInputs } from './supply-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

import {
  VerificationErrorBanners,
  VerificationWarningBanners,
} from 'shared/components';

export const SupplyForm = () => {
  return (
    <SupplyFormProvider>
      <VerificationErrorBanners action="supply" />
      <Suppliable />
      <SupplyFormInputs />
      <VerificationWarningBanners action="supply" />
      <SubmitButton />
      <TxInfo />
    </SupplyFormProvider>
  );
};
