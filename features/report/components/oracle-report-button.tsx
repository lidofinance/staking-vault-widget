import { useState } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { SubmitModal } from 'shared/components';
import { SubmitStep, SubmitStepEnum } from 'shared/components/submit-modal';

import { useSendReport, useReportStatus } from '../use-report';

import type { Address } from 'viem';

export type OracleReportButtonProps = React.PropsWithChildren<{
  ensureFreshReport?: boolean;
}>;

export type ModalState = {
  step: SubmitStep;
  tx?: Address;
};

export const OracleReportButton = ({
  ensureFreshReport = true,
  children,
}: OracleReportButtonProps) => {
  const [submitStep, setSubmitStep] = useState<ModalState>(() => ({
    step: SubmitStepEnum.edit,
  }));
  const { shouldApplyReport } = useReportStatus();
  const { mutate, isPending } = useSendReport({ setModalState: setSubmitStep });

  return (
    <>
      {shouldApplyReport && ensureFreshReport ? (
        <Button
          loading={isPending}
          onClick={() => {
            mutate();
          }}
        >
          Apply Oracle Report
        </Button>
      ) : (
        children
      )}
      <SubmitModal setModalState={setSubmitStep} submitStep={submitStep} />
    </>
  );
};
