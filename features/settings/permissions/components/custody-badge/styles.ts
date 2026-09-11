import styled from 'styled-components';

// no matching theme tokens for the custody accent — values taken from the design
const CUSTODY_BADGE_BACKGROUND = '#F9F3FC';
const CUSTODY_BADGE_COLOR = '#B35FE0';

export const CustodyBadgeStyled = styled.span`
  display: inline-block;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xs}px;
  background: ${CUSTODY_BADGE_BACKGROUND};
  color: ${CUSTODY_BADGE_COLOR};
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-transform: uppercase;
  white-space: nowrap;
`;
