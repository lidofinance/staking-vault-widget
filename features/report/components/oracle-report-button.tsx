import { useEffect, useMemo, useState } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { SubmitModal } from 'shared/components';
import { SubmitStep, SubmitStepEnum } from 'shared/components/submit-modal';

import { useSendReport, useReportStatus } from '../use-report';

import type { Address } from 'viem';
import {
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

export type OracleReportButtonProps = React.PropsWithChildren<{
  ensureFreshReport?: boolean;
  action?: string;
}>;

export type ModalState = {
  step: SubmitStep;
  tx?: Address;
};

export const OracleReportButton = ({
  ensureFreshReport = true,
  action,
  children,
}: OracleReportButtonProps) => {
  const [submitStep, setSubmitStep] = useState<ModalState>(() => ({
    step: SubmitStepEnum.edit,
  }));
  const { isReportAvailable } = useReportStatus();
  const { retryEvent, retryFire } = useFormControllerRetry();

  const { mutate, isPending } = useSendReport({ setModalState: setSubmitStep });

  useEffect(() => {
    return retryEvent.subscribe(mutate);
  }, [retryEvent, mutate]);

  const formControllerValue: FormControllerContextValueType = useMemo(
    () => ({
      onSubmit: () => {
        return Promise.resolve(true);
      },
      retryEvent,
      retryFire,
      onReset: () => {},
    }),
    [retryFire, retryEvent],
  );
  return (
    <>
      {isReportAvailable && ensureFreshReport ? (
        <Button
          loading={isPending}
          onClick={() => {
            mutate();
          }}
        >
          Apply Oracle Report {action ? `to unlock ${action}` : ''}
        </Button>
      ) : (
        children
      )}
      <FormControllerContext.Provider value={formControllerValue}>
        <SubmitModal setModalState={setSubmitStep} submitStep={submitStep} />
      </FormControllerContext.Provider>
    </>
  );
};
