import { CircleLoader } from 'shared/components';

import {
  Container,
  TablePlaceholder,
  ValidatorsTable,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

export const Validators = () => {
  const { isLoading, validators } = useValidators();

  return (
    <Container>
      <CircleLoader
        isLoading={isLoading}
        showBy={!!validators}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder />}
      >
        <ValidatorsTable />
      </CircleLoader>
    </Container>
  );
};
