import styled from 'styled-components';

import { Question } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const RoleDescriptionWrapper = styled.div`
  width: 50%;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  text-wrap: auto;

  & > span {
    line-height: 20px;
    color: ${({ theme }) => theme.colors.text};
  }

  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;

export const WarningIcon = styled(Question)`
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 20px;
  height: 20px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ContractRole = styled.p`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-feature-settings:
    'liga' off,
    'clig' off;
  font-family: 'Fira Code', monospace;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  word-break: break-word;
  color: ${({ theme }) => theme.colors.text};
`;

export const NonBreakableText = styled.span`
  word-break: keep-all;
  text-wrap-mode: nowrap;
`;
