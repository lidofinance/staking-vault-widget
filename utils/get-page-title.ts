import { vaultTexts } from 'modules/vaults';

export const getPageTitle = (title: string) =>
  `${title} ${vaultTexts.common.pageTitle}`;
