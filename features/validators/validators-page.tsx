import {
  AccumulatedInfo,
  Validators,
  AddValidator,
} from 'features/validators/content';

import { PageWrapper } from './styles';

export const ValidatorsPage = () => {
  return (
    <PageWrapper>
      <AccumulatedInfo />
      <AddValidator />
      <Validators />
    </PageWrapper>
  );
};
