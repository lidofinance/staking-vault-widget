import { Children, type FC, type PropsWithChildren, useMemo } from 'react';

import { StepperContext } from './context';
import { StepperContainer } from './styles';

import type { StepperProps } from './types';

export const Stepper: FC<PropsWithChildren<StepperProps>> = ({
  stepsCount,
  dataTestId,
  children,
}) => {
  // steps can be wrapped into their own feature components, so the count is
  // taken from the direct children instead of being injected into each Step
  const contextValue = useMemo(
    () => ({ stepsCount: stepsCount ?? Children.count(children) }),
    [stepsCount, children],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <StepperContainer data-testid={dataTestId}>{children}</StepperContainer>
    </StepperContext.Provider>
  );
};
