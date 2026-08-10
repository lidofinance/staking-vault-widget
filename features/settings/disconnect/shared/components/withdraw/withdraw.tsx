import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import { DescriptionAndMetrics, WithdrawForm } from './components';

import { WithdrawContainer } from './styles';

export const Withdraw = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.WITHDRAW);

  return (
    <Step {...stepProps} title="Withdraw ETH">
      <WithdrawContainer>
        <DescriptionAndMetrics />
        <WithdrawForm />
      </WithdrawContainer>
    </Step>
  );
};
