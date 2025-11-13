import styled from 'styled-components';

export const RadioSelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const DescriptionWrapper = styled.div`
  text-wrap: pretty;
  & p {
    display: inline;
  }
`;
