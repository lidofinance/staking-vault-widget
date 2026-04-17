import { CircleLoader } from 'shared/components';

import {
  Section,
  TablePlaceholder,
  ValidatorsTable,
} from 'features/validators/shared';
import { useValidators } from 'features/validators/contexts';

export const Validators = () => {
  const { isLoading, validators, isParamsDefault } = useValidators();

  return (
    <Section>
      <CircleLoader
        isLoading={isLoading}
        showBy={!(validators?.length === 0 && isParamsDefault)}
        size="medium"
        height="156px"
        placeholder={<TablePlaceholder />}
      >
        <ValidatorsTable />
      </CircleLoader>
    </Section>
  );
};
