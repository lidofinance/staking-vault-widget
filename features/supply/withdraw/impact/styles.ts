import styled from 'styled-components';
import { Question } from '@lidofinance/lido-ui';

export const ImpactWrapper = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const InfoBlock = styled.section`
  position: relative;
  padding: 12px; // not in the UI lib but actual for the spacing in this view block
  border: 1px solid var(--lido-color-border);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  width: fit-content;

  &:last-child {
    flex-grow: 1;
  }
`;

export const GaugeQuestion = styled(Question)`
  position: absolute;
  top: ${({ theme }) => theme.spaceMap.xs}px;
  right: ${({ theme }) => theme.spaceMap.xs}px;
  cursor: pointer;

  &:hover {
    fill: var(--lido-color-text);
  }
`;
