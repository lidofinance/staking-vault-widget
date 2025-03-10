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
