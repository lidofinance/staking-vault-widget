import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  cursor: pointer;
`;

export const NodeOperatorAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  cursor: pointer;
`;

export const NodeOperatorAddress = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
