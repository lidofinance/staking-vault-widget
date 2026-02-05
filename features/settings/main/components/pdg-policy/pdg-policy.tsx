import { FC } from 'react';
import { Text, Link } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { RadioPdgSelector } from '../controllers';
import { PDGPolicyBlock } from './styles';

const pdgPolicyTexts = vaultTexts.actions.settings.fields.pdgPolicy;
const lip5Url =
  'https://github.com/lidofinance/lido-improvement-proposals/blob/develop/LIPS/lip-5.md';
const learnMoreUrl =
  'https://docs.lido.fi/run-on-lido/stvaults/tech-documentation/pdg';

// TODO: add "Learn more."  to text
export const PdgPolicy: FC = () => {
  return (
    <PDGPolicyBlock>
      <Text size="xs" strong data-testid="pdgPolicy-title">
        {pdgPolicyTexts.title}
      </Text>
      <Text size="xxs">
        The Predeposit Guarantee (PDG) contract mitigates deposit frontrunning
        vulnerabilities outlined in{' '}
        <Link href={lip5Url} target="_blank" rel="noopener noreferrer">
          LIP-5
        </Link>
        . The PDG policy defines which operations are permitted under this
        mechanism.{' '}
        <Link href={learnMoreUrl} target="_blank" rel="noopener noreferrer">
          Learn more
        </Link>
        .
      </Text>
      <RadioPdgSelector vaultKey="pdgPolicy" />
    </PDGPolicyBlock>
  );
};
