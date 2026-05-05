import { SupplyFormProvider } from './supply-form-provider';

import { Suppliable } from './suppliable';
import { SupplyFormInputs } from './supply-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

import {
  AntiScamErrorBanners,
  AntiScamWarningBanners,
} from 'shared/components';

export const SupplyForm = () => {
  return (
    <SupplyFormProvider>
      <AntiScamErrorBanners action="supply" />
      <Suppliable />
      <SupplyFormInputs />
      <AntiScamWarningBanners action="supply" />
      <SubmitButton />
      <TxInfo />
    </SupplyFormProvider>
  );
};
