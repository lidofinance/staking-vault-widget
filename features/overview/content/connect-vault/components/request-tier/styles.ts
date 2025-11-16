import styled from 'styled-components';
import { Divider } from '@lidofinance/lido-ui';

export const RequestContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
  min-width: 50%;
  width: 50%;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`;

export const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const OptionDivider = styled(Divider)`
  color: ${({ theme }) => theme.colors.border};
`;
