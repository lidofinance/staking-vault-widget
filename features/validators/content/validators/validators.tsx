import { CircleLoader } from 'shared/components';

import {
  Section,
  TablePlaceholder,
  ValidatorsTable,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

export const Validators = () => {
  const { isLoading, validators, isParamsDefault, isError } = useValidators();

  return (
    <Section data-testid="validators-list">
      <CircleLoader
        isLoading={isLoading}
        showBy={!((validators?.length === 0 && isParamsDefault) || isError)}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder isError={isError} />}
      >
        <ValidatorsTable />
      </CircleLoader>
    </Section>
  );
};
