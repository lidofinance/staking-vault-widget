import styled from 'styled-components';

export const Title = styled.div`
  display: flex;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const Content = styled.section`
  display: flex;
  flex-wrap: wrap;
  column-gap: 52px;
  row-gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;
