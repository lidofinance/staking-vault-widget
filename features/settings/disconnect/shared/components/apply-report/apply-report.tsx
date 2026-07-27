import { Step } from 'shared/components';

import { Description, ApplyReportAction } from './components';

import { ApplyReportContainer } from './styles';

export const ApplyReport = () => {
  return (
    <Step
      number={2}
      title="Apply the next Oracle report and disconnect from VaultHub"
    >
      <ApplyReportContainer>
        <Description />
        <ApplyReportAction />
      </ApplyReportContainer>
    </Step>
  );
};
