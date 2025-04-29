import styled from 'styled-components';
import WarningIconSrc from 'assets/icons/attention-triangle-ipfs.svg';

export const ErrorMessageWrapper = styled.div`
  display: flex;
  background-color: #fffae0;
  grid-area: error;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  color: #ec8600;
`;

export const WarningIcon = styled.img.attrs({
  src: WarningIconSrc,
  alt: 'warning',
})`
  display: block;
  width: 20px;
  height: 20px;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`;
