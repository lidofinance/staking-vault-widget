import styled from 'styled-components';

type ItemWrapperStyleProps = {
  filled: boolean;
};

export const ItemWrapper = styled.div<ItemWrapperStyleProps>`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme, filled }) =>
    filled ? theme.colors.background : 'transparent'};
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
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;
