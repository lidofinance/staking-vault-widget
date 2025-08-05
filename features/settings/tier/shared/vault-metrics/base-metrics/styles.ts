import styled from 'styled-components';
import { Address, InlineLoader } from '@lidofinance/lido-ui';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const IndicatorContent = styled.div<{ align: 'start' | 'end' }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align};
`;

export const AddressContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const AddressStyled = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: bold;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export const InlineLoaderStyled = styled(InlineLoader)`
  height: 20px;
  width: 100px;
`;
