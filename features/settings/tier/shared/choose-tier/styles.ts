import styled from 'styled-components';

export const TierSelector = styled.div<{ $showCursor: boolean | undefined }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: fit-content;
  cursor: ${({ $showCursor }) => ($showCursor ? 'pointer' : 'default')};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
`;
