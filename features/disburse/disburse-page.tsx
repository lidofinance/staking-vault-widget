import { DisconnectedVault } from 'shared/components';

import { Disburse } from './disburse-form';

import { PageWrapper } from './styles';

export const DisbursePage = () => {
  return (
    <PageWrapper>
      <DisconnectedVault />
      <Disburse />
    </PageWrapper>
  );
};
