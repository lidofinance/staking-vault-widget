import { FC, useMemo } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext } from 'react-hook-form';
import { RoleFieldSchema } from 'features/settings/main/types';
import { multipleDataFields } from 'features/settings/main/consts';
import { useMainSettingsData } from 'features/settings/main/contexts';
import { ConnectWalletButton } from 'shared/wallet';

export const MainSettingsAction: FC = () => {
  const {
    watch,
    formState: { isValid, isDirty, isSubmitting, isValidating },
    reset,
  } = useFormContext();
  const mainSettingsData = useMainSettingsData();
  const isClearDisabled = !isDirty;
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting || isValidating;
  const { nodeOperatorFeeBPCurrent, confirmExpiryCurrent } = useMemo(() => {
    if (mainSettingsData) {
      const nodeOperatorFeeBPCurrent = mainSettingsData.nodeOperatorFeeBP.find(
        (item) => item.type === 'current',
      )?.value;
      const confirmExpiryCurrent = mainSettingsData.confirmExpiry.find(
        (item) => item.type === 'current',
      )?.value;

      return { nodeOperatorFeeBPCurrent, confirmExpiryCurrent };
    }

    return { nodeOperatorFeeBPCurrent: 0, confirmExpiryCurrent: 0 };
  }, [mainSettingsData]);
  const formFields = watch();

  const handleClearMainForm = () => {
    reset();
  };

  const [buttonText, counter] = useMemo(() => {
    let counter = 0;

    if (!isSubmitDisabled) {
      multipleDataFields.forEach((key) => {
        const fields = formFields[key];
        const [grant, remove] = fields.reduce(
          (acc: [number, number], field: RoleFieldSchema) => {
            acc[0] += Number(field.state === 'grant');
            acc[1] += Number(field.state === 'remove');
            return acc;
          },
          [0, 0],
        );
        counter += Number(grant > 0) + Number(remove > 0);
      });

      const {
        nodeOperatorFeeBP,
        nodeOperatorFeeBPCustom,
        confirmExpiry,
        confirmExpiryCustom,
      } = formFields;

      if (
        nodeOperatorFeeBP !== 'other' &&
        Number(nodeOperatorFeeBP) !== nodeOperatorFeeBPCurrent
      ) {
        counter++;
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      } else if (nodeOperatorFeeBP === 'other' && !!nodeOperatorFeeBPCustom) {
        counter++;
      }

      if (
        confirmExpiry !== 'other' &&
        Number(confirmExpiry) !== confirmExpiryCurrent
      ) {
        counter++;
        // eslint-disable-next-line sonarjs/no-duplicated-branches
      } else if (confirmExpiry === 'other' && !!confirmExpiryCustom) {
        counter++;
      }

      if (counter > 0) {
        return [
          `Submit ${counter} transaction${counter > 1 ? 's' : ''}`,
          counter,
        ];
      }
    }

    return ['No changes', counter];
  }, [
    formFields,
    isSubmitDisabled,
    nodeOperatorFeeBPCurrent,
    confirmExpiryCurrent,
  ]);

  const hasChanges = counter > 0;

  return (
    <Container>
      <ConnectWalletButton>
        <Button
          type="button"
          variant="outlined"
          disabled={isClearDisabled || !hasChanges}
          onClick={handleClearMainForm}
          fullwidth
        >
          Clear changes
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled || !hasChanges}
          fullwidth
        >
          {buttonText}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
