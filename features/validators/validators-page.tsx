import { AccumulatedInfo, Validators } from 'features/validators/content';
import { ValidatorsTableProvider } from 'features/validators/contexts';

import { PageWrapper } from './styles';

export const ValidatorsPage = () => {
  return (
    <PageWrapper>
      <ValidatorsTableProvider>
        <AccumulatedInfo />
        <Validators />
      </ValidatorsTableProvider>
    </PageWrapper>
  );
};
