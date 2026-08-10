import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import { Description, ApplyReportAction } from './components';

import { ApplyReportContainer } from './styles';

export const ApplyReport = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.APPLY_REPORT);

  return (
    <Step
      {...stepProps}
      title="Apply the next Oracle report and disconnect from VaultHub"
      dataTestId="disconnect-step-2"
    >
      <ApplyReportContainer data-testid="apply-report">
        <Description />
        <ApplyReportAction />
      </ApplyReportContainer>
    </Step>
  );
};
