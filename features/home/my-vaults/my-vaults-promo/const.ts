import { config } from 'config';
import { vaultTexts } from 'modules/vaults/consts';
import { NO_IDENTIFICATION_LINK } from 'shared/components';

const { rootOrigin, docsOrigin } = config;

export const LEARN_MORE_LINK = `${rootOrigin}/stvaults`;
export const START_BUILDING_LINK = `${docsOrigin}/run-on-lido/stvaults/`;

const texts = vaultTexts.promo;

export const PROMO_CARDS = [
  {
    ...texts.startBuilding,
    href: START_BUILDING_LINK,
    dataTestId: 'myVaults-promoStartBuilding',
  },
  {
    ...texts.getIdentified,
    href: NO_IDENTIFICATION_LINK,
    dataTestId: 'myVaults-promoGetIdentified',
  },
];
