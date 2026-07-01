import { vaultTexts } from 'modules/vaults';

import {
  ManageDeposits,
  PdgPolicy,
  PdgTrust,
  IdentificationProcess,
} from 'features/settings/main/components';

import { GroupHeading, GroupWrapper, InputGroup } from '../styles';

const { deposits } = vaultTexts.actions.settings.groups;

export const Pdg = () => {
  return (
    <GroupWrapper>
      <GroupHeading as="h3">{deposits}</GroupHeading>
      <InputGroup>
        <ManageDeposits />
        <PdgPolicy />
        <IdentificationProcess />
        <PdgTrust />
      </InputGroup>
    </GroupWrapper>
  );
};
