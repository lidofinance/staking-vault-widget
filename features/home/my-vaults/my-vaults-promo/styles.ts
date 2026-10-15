import styled, { css } from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

const CARD_RADIUS = 32;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const LearnMoreBanner = styled.a`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.sm + 4}px;
  margin-bottom: -${CARD_RADIUS}px;
  padding: 12px ${({ theme }) => theme.spaceMap.xxl}px 44px;
  border-radius: ${CARD_RADIUS}px ${CARD_RADIUS}px 0 0;
  background: radial-gradient(
    circle at 100% 0%,
    #9995ff 0%,
    #7b7eff 25%,
    #5d67ff 50%,
    #404fff 75%,
    #2238ff 100%
  );
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 700;
  line-height: 24px;
  color: #fff;
  text-decoration: none;

  &:hover,
  &:visited {
    color: #fff;
  }
`;

export const ArrowIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  & > svg {
    transform: rotate(-90deg);
  }
`;

const card = css`
  position: relative;
  border-radius: ${CARD_RADIUS}px;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  background-color: ${({ theme }) => theme.colors.foreground};
`;

export const HeroCard = styled.div`
  ${card}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const HeroHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const Illustration = styled.div`
  display: flex;
  justify-content: center;
  width: 280px;
  height: 280px;
  padding-top: 10px;
`;

export const HeroTitle = styled.h1`
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  font-size: 48px;
  font-weight: 700;
  line-height: 52px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const HeroButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.sm + 4}px;
  width: 100%;
`;

export const HeroButton = styled(Button)`
  flex: 1 0 0;
`;

export const PromoCardWrapper = styled.div`
  ${card}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm + 4}px;
`;

export const PromoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const PromoCardTitle = styled.h3`
  flex: 1 0 0;
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

export const PromoCardAction = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 32px;
  padding: 6px ${({ theme }) => theme.spaceMap.md}px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 20px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;

  &:hover,
  &:visited {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: color-mix(
      in display-p3,
      ${({ theme }) => theme.colors.primary} 8%,
      transparent
    );
  }
`;
