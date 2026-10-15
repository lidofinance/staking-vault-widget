import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useConnect } from 'reef-knot/core-react';

import { ReactComponent as StVaultIllustration } from 'assets/stvault.svg';
import { ReactComponent as ArrowIcon } from 'assets/icons/arrow-down.svg';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { NO_IDENTIFICATION_LINK } from 'shared/components';

import { LEARN_MORE_LINK, START_BUILDING_LINK } from './const';
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
  PromoCardWrapper,
  PromoCardHeader,
  PromoCardTitle,
  PromoCardAction,
} from './styles';

type PromoCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  dataTestId: string;
};

const PromoCard: FC<PromoCardProps> = ({
  title,
  description,
  actionLabel,
  href,
  dataTestId,
}) => (
  <PromoCardWrapper>
    <PromoCardHeader>
      <PromoCardTitle>{title}</PromoCardTitle>
      <PromoCardAction
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={dataTestId}
      >
        {actionLabel}
      </PromoCardAction>
    </PromoCardHeader>
    <Description>{description}</Description>
  </PromoCardWrapper>
);

export const MyVaultsPromo: FC = () => {
  const router = useRouter();
  const { connect } = useConnect();

  const handleConnect = () => {
    void connect();
  };

  const handleCreate = () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickCreateNewVault);
    void router.push(appPaths.vaults.create);
  };

  return (
    <Wrapper>
      <HeroWrapper>
        <LearnMoreBanner
          href={LEARN_MORE_LINK}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="myVaults-promoLearnMore"
        >
          Learn more about stVaults
          <ArrowIconWrapper>
            <ArrowIcon />
          </ArrowIconWrapper>
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
              size="lg"
              onClick={handleConnect}
              data-testid="myVaults-promoSeeVaults"
            >
              See my stVaults
            </HeroButton>
            <HeroButton
              size="lg"
              color="secondary"
              onClick={handleCreate}
              data-testid="myVaults-promoCreateVault"
            >
              Create new stVault
            </HeroButton>
          </HeroButtons>
        </HeroCard>
      </HeroWrapper>
      <PromoCard
        title="Create a product powered by stVaults"
        description="Explore reference product architectures and follow the step-by-step implementation guide for your staking use case."
        actionLabel="Start building"
        href={START_BUILDING_LINK}
        dataTestId="myVaults-promoStartBuilding"
      />
      <PromoCard
        title="Validate with stVaults"
        description="Become an Identified Node Operator to unlock better Reserve Ratios, higher stETH minting limits, and make your staking services more attractive to product builders."
        actionLabel="Get identified"
        href={NO_IDENTIFICATION_LINK}
        dataTestId="myVaults-promoGetIdentified"
      />
    </Wrapper>
  );
};
