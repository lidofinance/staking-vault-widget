import { VaultConnectionBanner } from 'shared/components';

import { AccumulatedInfo, Validators } from 'features/validators/content';
import { ValidatorsTableProvider } from 'features/validators/contexts';

import { PageWrapper } from './styles';

export const ValidatorsPage = () => {
  return (
    <PageWrapper data-testid="validators-page">
      <VaultConnectionBanner />
      <ValidatorsTableProvider>
        <AccumulatedInfo />
        <Validators />
      </ValidatorsTableProvider>
    </PageWrapper>
  );
};
