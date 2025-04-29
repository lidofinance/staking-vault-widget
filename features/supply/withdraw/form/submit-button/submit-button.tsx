import { OracleReportButton } from 'features/report';
import { PermissionedSubmitButton } from 'modules/vaults/components';

import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();
  const disabled = isSubmitting || !isValid || !isDirty;

  return (
    <OracleReportButton action="withdrawal">
      <PermissionedSubmitButton
        type="submit"
        dashboardRole="withdrawer"
        disabled={disabled}
      >
        Withdraw
      </PermissionedSubmitButton>
    </OracleReportButton>
  );
};
