import {
  type FC,
  type KeyboardEvent,
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
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const isControlled = isExpanded !== undefined;
  const isContentVisible =
    !isAllowExpand || (isControlled ? isExpanded : isOpen);
  const isLastStep = isLast ?? number === context?.stepsCount;

  const handleToggle = useCallback(() => {
    if (!isAllowExpand) return;

    const nextIsExpanded = !(isControlled ? isExpanded : isOpen);

    if (!isControlled) {
      setIsOpen(nextIsExpanded);
    }
    onToggle?.(nextIsExpanded);
  }, [isAllowExpand, isControlled, isExpanded, isOpen, onToggle]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      handleToggle();
    },
    [handleToggle],
  );

  return (
    <StepContainer data-testid={dataTestId}>
      <StepMarker data-testid={dataTestId ? `${dataTestId}-marker` : undefined}>
        {status === 'pending' ? (
          <StepNumber size="xxs" color="secondary">
            {number}
          </StepNumber>
        ) : (
          iconList[status]
        )}
      </StepMarker>
      {!isLastStep && <StepConnector $isSuccess={status === 'success'} />}
      <StepHeader
        $isClickable={isAllowExpand}
        role={isAllowExpand ? 'button' : undefined}
        tabIndex={isAllowExpand ? 0 : undefined}
        aria-expanded={isAllowExpand ? isContentVisible : undefined}
        onClick={isAllowExpand ? handleToggle : undefined}
        onKeyDown={isAllowExpand ? handleKeyDown : undefined}
      >
        <StepTitle data-testid={dataTestId ? `${dataTestId}-title` : undefined}>
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
