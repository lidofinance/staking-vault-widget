import styled from 'styled-components';

export const InputTitle = styled.p`
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const InputNotes = styled.p`
  margin-top: 8px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

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
