import { vaultTexts } from 'modules/vaults';

import {
  Admins,
  NodeOperator,
  NodeOperatorFeeRecipient,
} from 'features/settings/main/components';

import { GroupHeading, GroupWrapper, InputGroup } from '../styles';

const { address } = vaultTexts.actions.settings.groups;

export const Addresses = () => {
  return (
    <GroupWrapper>
      <GroupHeading as="h3">{address}</GroupHeading>
      <InputGroup>
        <NodeOperator />
        <Admins />
        <NodeOperatorFeeRecipient />
      </InputGroup>
    </GroupWrapper>
  );
};
