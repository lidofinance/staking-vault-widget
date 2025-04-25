import styled from 'styled-components';

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
`;

export const LoaderWrapper = styled.div`
  padding-top: ${({ theme }) => theme.spaceMap.sm}px;
  padding-bottom: 10px;
`;

export const ValueWrapper = styled.div`
  padding-bottom: 8px;
`;
