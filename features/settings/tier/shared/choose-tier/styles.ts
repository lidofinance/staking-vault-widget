import styled from 'styled-components';

export const TierSelector = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
`;
