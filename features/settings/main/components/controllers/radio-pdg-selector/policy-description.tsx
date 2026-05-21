import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { vaultTexts, type PDGOptions } from 'modules/vaults';

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
