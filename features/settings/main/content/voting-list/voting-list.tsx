import { vaultTexts } from 'modules/vaults';

import { Voting } from 'features/settings/main/components';

import { GroupHeading, GroupWrapper, InputGroup } from '../styles';

const { settings } = vaultTexts.actions.settings.groups;

export const VotingList = () => {
  return (
    <GroupWrapper>
      <GroupHeading as="h3">{settings}</GroupHeading>
      <InputGroup>
        <Voting />
      </InputGroup>
    </GroupWrapper>
  );
};
