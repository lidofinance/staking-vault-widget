import {
  AccumulatedInfo,
  Validators,
  AddValidator,
} from 'features/validators/content';
import { ValidatorsTableProvider } from 'features/validators/contexts';

import { PageWrapper } from './styles';

export const ValidatorsPage = () => {
  return (
    <PageWrapper>
      <ValidatorsTableProvider>
        <AccumulatedInfo />
        <AddValidator />
        <Validators />
      </ValidatorsTableProvider>
    </PageWrapper>
  );
};
