import { ValidatorsTableProvider } from 'features/validators/contexts';
import { Container, ValidatorsTable } from 'features/validators/shared';

export const Validators = () => {
  return (
    <Container>
      <ValidatorsTableProvider>
        <ValidatorsTable />
      </ValidatorsTableProvider>
    </Container>
  );
};
