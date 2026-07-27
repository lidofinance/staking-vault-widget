import { Step } from 'shared/components';

import { OwnershipDescription, OwnershipAction } from './components';

import { AcceptContainer } from './styles';

export const AcceptOwnership = () => {
  return (
    <Step number={4} title="Accept ownership by a new owner">
      <AcceptContainer>
        <OwnershipDescription />
        <OwnershipAction />
      </AcceptContainer>
    </Step>
  );
};
