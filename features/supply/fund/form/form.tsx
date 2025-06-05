import { Balance } from './balance';
import { Inputs } from './inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';
import { FundFormProvider } from './fund-form-provider';

export const FundForm = () => {
  return (
    <FundFormProvider>
      <Balance />
      <Inputs />
      <SubmitButton />
      <TxInfo />
    </FundFormProvider>
  );
};
