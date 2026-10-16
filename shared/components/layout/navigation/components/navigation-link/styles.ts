import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

export const ListItem = styled.li`
  display: flex;
  align-items: center;

  @media ${devicesHeaderMedia.mobile} {
    flex-grow: 1;
    justify-content: center;
  }
`;

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const NavLink = styled.span<{ active: boolean }>`
  cursor: pointer;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-decoration: none !important;
  opacity: ${(props) => (props.active ? 1 : 0.6)};

  &:hover {
    opacity: 1;
    color: var(--lido-color-text);
  }

  svg {
    flex-shrink: 0;
    color: ${({ active }) =>
      active ? `var(--lido-color-primary)` : `var(--lido-color-text)`};
  }

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--lido-color-secondary);
    font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
    line-height: 1.7em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: ${(props) => (props.active ? 1 : 0.8)};
    white-space: break-spaces;
    text-wrap: balance;
    line-break: anywhere;

    &:hover {
      color: var(--lido-color-secondary);
    }

    svg {
      width: 24px;
      height: 24px;
      color: ${({ active }) =>
        active ? `var(--lido-color-primary)` : `var(--lido-color-secondary)`};
    }
  }
`;
