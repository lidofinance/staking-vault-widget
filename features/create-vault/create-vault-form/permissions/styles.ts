import styled from 'styled-components';

export const PermissionWrapper = styled.section<{ step: number }>`
  display: ${({ step }) => (step === 1 ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const PermissionContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const PermissionBlock = styled.div`
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const PermissionRoleWrapper = styled.div`
  display: flex;
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
