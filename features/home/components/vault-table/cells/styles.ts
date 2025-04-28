import styled from 'styled-components';

export const Mintable = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Percent = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
`;

export const AddressWrapper = styled.div`
  cursor: pointer;
`;
