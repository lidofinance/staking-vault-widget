import styled from 'styled-components';

export const PermissionContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const PermissionBlock = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PermissionRoleWrapper = styled.div<{
  $align?: 'center' | 'baseline';
}>`
  display: flex;
  align-items: ${({ $align }) => $align ?? 'initial'};
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

export const PermissionGroupTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;
