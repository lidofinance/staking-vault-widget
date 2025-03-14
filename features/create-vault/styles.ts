import styled from 'styled-components';
import { Container } from '@lidofinance/lido-ui';

export const PageWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin-top: 16px;
  padding: 0;

  & form {
    width: 100%;
  }
`;

export const SectionContainer = styled.section<{
  step: number;
  currentStep: number;
}>`
  display: ${({ step, currentStep }) =>
    step === currentStep ? 'flex' : 'none'};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;
