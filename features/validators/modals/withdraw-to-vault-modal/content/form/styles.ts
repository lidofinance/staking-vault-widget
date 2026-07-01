import styled from 'styled-components';

export const FormContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ActionContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
