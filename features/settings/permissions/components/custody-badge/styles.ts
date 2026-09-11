import styled from 'styled-components';

export const CustodyBadgeStyled = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: #f9f3fc;
  color: #b35fe0;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-transform: uppercase;
  white-space: nowrap;
`;
