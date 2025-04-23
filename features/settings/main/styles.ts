import styled from 'styled-components';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;
