import { createContext, useContext } from 'react';

type StepperContextValue = {
  stepsCount: number;
};

export const StepperContext = createContext<StepperContextValue | null>(null);

export const useStepperContext = () => useContext(StepperContext);
