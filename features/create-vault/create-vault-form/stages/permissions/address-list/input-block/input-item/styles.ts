import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  align-items: center;

  & > label {
    flex-grow: 1;
  }
`;
