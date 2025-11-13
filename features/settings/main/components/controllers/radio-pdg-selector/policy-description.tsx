import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import type { PDGOptions } from 'features/settings/main/types';

import { DescriptionWrapper } from './styles';

type PolicyDescriptionProps = {
  option: PDGOptions;
};

const descriptions =
  vaultTexts.actions.settings.fields.pdgPolicy.optionsDescription;
export const PolicyDescription: FC<PolicyDescriptionProps> = ({ option }) => {
  return (
    <DescriptionWrapper>
      <Text size="xs">{option}:</Text>
      <Text size="xs" color="secondary">
        {' '}
        {descriptions[option]}
      </Text>
    </DescriptionWrapper>
  );
};
