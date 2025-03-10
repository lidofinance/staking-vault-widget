import styled from 'styled-components';

export const Container = styled.section<{ step: number }>`
  display: ${({ step }) => (step === 2 ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;
