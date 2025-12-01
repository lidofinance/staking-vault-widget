import styled from 'styled-components';

export const FormContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  width: 100%;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  border-radius: 20px;
  margin: 0;
  padding: 32px;
  box-shadow: none;
  background: var(--lido-color-foreground);
  color: var(--lido-color-textSecondary);
`;
