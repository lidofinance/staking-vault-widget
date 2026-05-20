import { RepayFormProvider } from './repay-form-context';

import { Repayable } from './repayable';
import { RepayFormInputs } from './repay-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

import {
  VerificationErrorBanners,
  VerificationWarningBanners,
} from 'shared/components';

export const RepayForm = () => {
  return (
    <RepayFormProvider>
      <VerificationErrorBanners action="repay" />
      <Repayable />
      <RepayFormInputs />
      <VerificationWarningBanners action="repay" />
      <SubmitButton />
      <TxInfo />
    </RepayFormProvider>
  );
};
