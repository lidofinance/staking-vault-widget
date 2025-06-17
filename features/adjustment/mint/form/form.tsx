import { MintFormProvider } from './mint-form-context';

import { Mintable } from './mintable';
import { MintFormInputs } from './inputs';
import { SubmitButton } from './submit-button';
import { TxInfo } from './tx-info';

export const MintForm = () => {
  return (
    <MintFormProvider>
      <Mintable />
      <MintFormInputs />
      <SubmitButton />
      <TxInfo />
    </MintFormProvider>
  );
};
