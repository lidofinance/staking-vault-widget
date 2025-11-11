import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${({ theme }) =>
    `color-mix(in display-p3, ${theme.colors.textSecondary} 10%, transparent)`};
`;
