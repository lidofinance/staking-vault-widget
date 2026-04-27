import styled from 'styled-components';

export const BadgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 210px;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
`;
