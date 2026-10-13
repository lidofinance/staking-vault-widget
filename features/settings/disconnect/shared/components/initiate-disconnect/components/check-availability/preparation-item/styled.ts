import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
