import { RepayFormProvider } from './repay-form-context';

import { Repayable } from './repayable';
import { RepayFormInputs } from './repay-form-inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

import {
  AntiScamErrorBanners,
  AntiScamWarningBanners,
} from 'shared/components';

export const RepayForm = () => {
  return (
    <RepayFormProvider>
      <AntiScamErrorBanners action="repay" />
      <Repayable />
      <RepayFormInputs />
      <AntiScamWarningBanners action="repay" />
      <SubmitButton />
      <TxInfo />
    </RepayFormProvider>
  );
};
