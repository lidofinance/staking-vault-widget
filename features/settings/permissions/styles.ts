import styled from 'styled-components';

export const FormAndContentWrapper = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  overflow: hidden;
  max-width: 600px;
  width: 100%;
`;
