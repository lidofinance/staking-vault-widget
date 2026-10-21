import type { FC } from 'react';

import { ReactComponent as StVaultIllustration } from 'assets/stvault.svg';
import { STVAULTS_ABOUT_LINK } from 'consts/external-links';
import { vaultTexts } from 'modules/vaults/consts';

import { useCreateVaultActions } from '../use-create-vault-actions';
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
import { PROMO_CARDS } from './const';

const texts = vaultTexts.promo.hero;

export const MyVaultsPromo: FC = () => {
  const { handleConnect, handleCreate } = useCreateVaultActions();

  return (
    <Wrapper>
      <HeroWrapper>
        <LearnMoreBanner>
          <LearnMoreLink
            href={STVAULTS_ABOUT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="myVaults-promoLearnMore"
          >
            {texts.learnMore}
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
            <HeroTitle>{texts.title}</HeroTitle>
            <Description>{texts.description}</Description>
          </HeroHeader>
          <HeroButtons>
            <HeroButton
              size="md"
              onClick={handleConnect}
              data-testid="myVaults-promoSeeVaults"
            >
              {texts.seeVaults}
            </HeroButton>
            <HeroButton
              size="md"
              color="secondary"
              onClick={handleCreate}
              data-testid="myVaults-promoCreateVault"
            >
              {texts.createVault}
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
