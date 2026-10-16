import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useConnect } from 'reef-knot/core-react';

import { ReactComponent as StVaultIllustration } from 'assets/stvault.svg';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { PromoCard } from './promo-card';
import {
  Wrapper,
  HeroWrapper,
  LearnMoreBanner,
  ArrowIconWrapper,
  HeroCard,
  HeroHeader,
  Illustration,
  HeroTitle,
  Description,
  HeroButtons,
  HeroButton,
  ArrowIcon,
  LearnMoreLink,
} from './styles';
import { LEARN_MORE_LINK, PROMO_CARDS } from './const';

export const MyVaultsPromo: FC = () => {
  const router = useRouter();
  const { connect } = useConnect();

  const handleConnect = useCallback(() => {
    void connect();
  }, [connect]);

  const handleCreate = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickCreateNewVault);
    void router.push(appPaths.vaults.create);
  }, [router]);

  return (
    <Wrapper>
      <HeroWrapper>
        <LearnMoreBanner>
          <LearnMoreLink
            href={LEARN_MORE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="myVaults-promoLearnMore"
          >
            Learn more about stVaults
            <ArrowIconWrapper>
              <ArrowIcon />
            </ArrowIconWrapper>
          </LearnMoreLink>
        </LearnMoreBanner>
        <HeroCard>
          <HeroHeader>
            <Illustration>
              <StVaultIllustration />
            </Illustration>
            <HeroTitle>stVaults</HeroTitle>
            <Description>
              stVaults (Staking Vaults) bring the benefits of stETH to fully
              custom staking setups. They can be utilized as a liquid staking
              solution to stake with a dedicated Node Operator, or as a basis
              for creating private or public staking products.
            </Description>
          </HeroHeader>
          <HeroButtons>
            <HeroButton
              size="md"
              onClick={handleConnect}
              data-testid="myVaults-promoSeeVaults"
            >
              See my stVaults
            </HeroButton>
            <HeroButton
              size="md"
              color="secondary"
              onClick={handleCreate}
              data-testid="myVaults-promoCreateVault"
            >
              Create new stVault
            </HeroButton>
          </HeroButtons>
        </HeroCard>
      </HeroWrapper>
      {PROMO_CARDS.map((card) => (
        <PromoCard key={card.dataTestId} {...card} />
      ))}
    </Wrapper>
  );
};
