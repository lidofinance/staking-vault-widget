import type { FC } from 'react';
import { Link } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { config } from 'config';

import { WarningInfo } from 'features/validators/shared';

type NotInPdgProps = {
  isValidatorInPDG: boolean;
};

const { validatorWithoutPDG } = vaultTexts.actions.validators.modals.topUp;
const { docsOrigin } = config;
const pdgDocsLink = `${docsOrigin}/run-on-lido/stvaults/tech-documentation/pdg/#pdg-shortcut`;

export const NotInPdg: FC<NotInPdgProps> = ({ isValidatorInPDG }) => {
  if (isValidatorInPDG) {
    return null;
  }

  return (
    <WarningInfo>
      {validatorWithoutPDG} <Link href={pdgDocsLink}>Learn more</Link>
    </WarningInfo>
  );
};
