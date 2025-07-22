import styled from 'styled-components';
import { Heading, Text } from '@lidofinance/lido-ui';

export const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const TitleWrapper = styled.header`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubTitle = styled(Text)`
  text-align: end;
`;

export const HeaderText = styled(Heading)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 400;
  line-height: 24px;
`;
