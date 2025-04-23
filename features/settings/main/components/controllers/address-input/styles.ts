import styled from 'styled-components';

export const AddressInputWrapper = styled.div`
  position: relative;
`;

export const EtherScanLink = styled.span`
  position: absolute;
  top: 6px;
  right: ${({ theme }) => theme.spaceMap.md}px;
  z-index: 5;
  width: fit-content;

  & > a {
    text-wrap: nowrap;
  }
`;
