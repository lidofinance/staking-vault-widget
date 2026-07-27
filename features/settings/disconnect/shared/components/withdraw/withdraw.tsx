import { Step } from 'shared/components';

import { DescriptionAndMetrics, WithdrawForm } from './components';

import { WithdrawContainer } from './styles';

export const Withdraw = () => {
  return (
    <Step number={5} title="Withdraw ETH">
      <WithdrawContainer>
        <DescriptionAndMetrics />
        <WithdrawForm />
      </WithdrawContainer>
    </Step>
  );
};
