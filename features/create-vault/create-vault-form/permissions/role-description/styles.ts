import styled from 'styled-components';

import { Question } from '@lidofinance/lido-ui';

export const RoleDescriptionWrapper = styled.div`
  width: 50%;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  text-wrap: balance;

  & > span {
    line-height: 24px;
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const WarningIcon = styled(Question)`
  display: inline-block;
  margin-bottom: 0.4px;
  vertical-align: middle;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;
