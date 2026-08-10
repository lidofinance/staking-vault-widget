import { VaultConnectionBanner } from 'shared/components';

import { Disburse } from './disburse-form';

import { PageWrapper } from './styles';

export const DisbursePage = () => {
  return (
    <PageWrapper>
      <VaultConnectionBanner />
      <Disburse />
    </PageWrapper>
  );
};
