import type { ReactNode } from 'react';

export type StepStatus = 'pending' | 'success' | 'error' | 'loading';

export type StepperProps = {
  stepsCount?: number;
  dataTestId?: string;
};

export type StepperStepProps = {
  number: number;
  title: ReactNode;
  status?: StepStatus;
  isAllowExpand?: boolean;
  defaultExpanded?: boolean;
  isExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  isLast?: boolean;
  dataTestId?: string;
};
