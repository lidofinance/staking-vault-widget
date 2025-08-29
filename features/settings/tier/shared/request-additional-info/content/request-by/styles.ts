import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

export const RequestByContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AddressStyled = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
