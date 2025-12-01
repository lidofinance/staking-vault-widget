import styled from 'styled-components';

export const SlashingInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  margin-top: ${({ theme }) => theme.spaceMap.xs}px;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const IconWrapper = styled.div`
  width: 20px;
`;
