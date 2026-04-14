import { CircleLoader } from 'shared/components';

import {
  Section,
  TablePlaceholder,
  ValidatorsTable,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

export const Validators = () => {
  const { isLoading, validators } = useValidators();

  return (
    <Section>
      <CircleLoader
        isLoading={isLoading && !validators}
        showBy={!!validators}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder />}
      >
        <ValidatorsTable />
      </CircleLoader>
    </Section>
  );
};
