import styled from 'styled-components';

import { Address } from '@lidofinance/lido-ui';

export const PillContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-shadowLight);
  white-space: nowrap;
  text-wrap: nowrap;
`;

export const AddressText = styled(Address)`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
`;
