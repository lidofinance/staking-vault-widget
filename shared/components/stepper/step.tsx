import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import { Check, Close, Loader } from '@lidofinance/lido-ui';

import { useStepperContext } from './context';
import {
  StepConnector,
  StepContainer,
  StepContent,
  StepHeader,
  StepMarker,
  StepNumber,
  StepTitle,
} from './styles';

import type { StepStatus, StepperStepProps } from './types';

const iconList: Record<Exclude<StepStatus, 'pending'>, ReactNode> = {
  success: <Check fill="var(--lido-color-success)" />,
  error: <Close fill="var(--lido-color-error)" />,
  loading: <Loader size="small" />,
};

export const Step: FC<PropsWithChildren<StepperStepProps>> = ({
  number,
  title,
  status = 'pending',
  isAllowExpand = true,
  defaultExpanded = true,
  isExpanded,
  onToggle,
  isLast,
  dataTestId,
  children,
}) => {
  const context = useStepperContext();
  const [isOpen, setIsOpen] = useState(() => defaultExpanded);

  const isControlled = isExpanded !== undefined;
  const isContentVisible = isControlled ? isExpanded : isOpen;
  const isLastStep = isLast ?? number === context?.stepsCount;
  const isSuccess = status === 'success';

  const handleToggle = useCallback(() => {
    if (!isAllowExpand) return;

    const nextIsExpanded = !(isControlled ? isExpanded : isOpen);

    if (!isControlled) {
      setIsOpen(nextIsExpanded);
    }
    onToggle?.(nextIsExpanded);
  }, [isAllowExpand, isControlled, isExpanded, isOpen, onToggle]);

  return (
    <StepContainer data-testid={dataTestId}>
      <StepMarker
        $isSuccess={isSuccess}
        data-testid={dataTestId ? `${dataTestId}-marker` : undefined}
      >
        {status === 'pending' ? (
          <StepNumber
            size="xxs"
            strong
            color={isAllowExpand ? 'default' : 'secondary'}
          >
            {number}
          </StepNumber>
        ) : (
          iconList[status]
        )}
      </StepMarker>
      {!isLastStep && <StepConnector $isSuccess={isSuccess} />}
      <StepHeader
        $isClickable={isAllowExpand}
        role={isAllowExpand ? 'button' : undefined}
        aria-expanded={isAllowExpand ? isContentVisible : undefined}
        onClick={handleToggle}
      >
        <StepTitle
          $isAllowExpand={isAllowExpand}
          data-testid={dataTestId ? `${dataTestId}-title` : undefined}
        >
          {title}
        </StepTitle>
      </StepHeader>
      <StepContent
        $showContent={isContentVisible}
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        {children}
      </StepContent>
    </StepContainer>
  );
};
