import styled from 'styled-components';

export const ConfirmationWrapper = styled.section<{ step: number }>`
  display: ${({ step }) => (step === 3 ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;
