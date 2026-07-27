import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const StepperContainer = styled.section`
  display: flex;
  flex-direction: column;
`;

// 32px left keeps the content 20px away from the line at x=12px
export const StepContainer = styled.div`
  position: relative;
  padding: 0 0 12px 32px;
`;

export const StepMarker = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
`;

export const StepNumber = styled(Text)`
  line-height: 1;
`;

export const StepConnector = styled.span<{ $isSuccess: boolean }>`
  position: absolute;
  top: 24px;
  bottom: 0;
  left: 12px;
  width: 1px;
  transform: translateX(-50%);
  background-color: ${({ theme, $isSuccess }) =>
    $isSuccess ? theme.colors.success : theme.colors.border};
`;

export const StepHeader = styled.div<{ $isClickable: boolean }>`
  display: flex;
  align-items: center;
  min-height: 24px;
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
`;

// a plain span instead of lido-ui Text, so a ReactNode title does not end up
// nested inside a paragraph
export const StepTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const StepContent = styled.div<{ $showContent: boolean }>`
  padding: ${({ $showContent }) => ($showContent ? '20px 0' : '0')};
  height: ${({ $showContent }) => ($showContent ? 'auto' : '0')};
  overflow: hidden;
  transition:
    height 0.3s ease-in-out,
    padding 0.25s ease;
`;
