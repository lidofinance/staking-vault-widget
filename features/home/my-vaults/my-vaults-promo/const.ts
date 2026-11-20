import { STVAULTS_DOCS_LINK } from 'consts/external-links';
import { vaultTexts } from 'modules/vaults/consts';
import { NO_IDENTIFICATION_LINK } from 'shared/components';

const texts = vaultTexts.promo;

export const PROMO_CARDS = [
  {
    ...texts.startBuilding,
    href: STVAULTS_DOCS_LINK,
    dataTestId: 'myVaults-promoStartBuilding',
  },
  {
    ...texts.getIdentified,
    href: NO_IDENTIFICATION_LINK,
    dataTestId: 'myVaults-promoGetIdentified',
  },
];
