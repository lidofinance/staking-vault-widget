import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const ConfirmInfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  list-style: none;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spaceMap.sm}px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const PermissionTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;
