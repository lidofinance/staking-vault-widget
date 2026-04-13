import { CircleLoader } from 'shared/components';

import {
  Container,
  TablePlaceholder,
  ValidatorsTable,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

export const Validators = () => {
  const { isLoading } = useValidators();

  // TODO: return to CircleLoader
  // showBy={!!value.validators}
  return (
    <Container>
      <CircleLoader
        isLoading={isLoading}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder />}
      >
        <ValidatorsTable />
      </CircleLoader>
    </Container>
  );
};
