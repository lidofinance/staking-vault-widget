import { type FC, useMemo } from 'react';
import { Tooltip, Text } from '@lidofinance/lido-ui';

import { ROLES_TO_CONTRACT_CONSTANT } from 'modules/vaults';
import { getTestId } from 'utils';

import { CustodyBadge } from '../custody-badge';

import {
  WarningIcon,
  RoleDescriptionWrapper,
  ContractRole,
  ContractRoleRow,
  NonBreakableText,
} from './styles';

export type RoleDescriptionProps = {
  description: string;
  tooltip: string;
  contractRole?: (typeof ROLES_TO_CONTRACT_CONSTANT)[keyof typeof ROLES_TO_CONTRACT_CONSTANT];
  isCustody?: boolean;
  dataTestId?: string;
};

const splitDescription = (description: string) => {
  const words = description.split(' ').filter(Boolean);

  if (words.length === 1) {
    return {
      descriptionText: words[0],
    };
  }

  return {
    descriptionText: words.slice(0, -1).join(' '),
    lastWord: words[words.length - 1] ?? '',
  };
};

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description, tooltip, dataTestId, contractRole, isCustody } = props;
  const { descriptionText, lastWord } = useMemo(
    () => splitDescription(description),
    [description],
  );

  return (
    <RoleDescriptionWrapper
      data-testid={getTestId(dataTestId, 'roleDescriptionWrapper')}
    >
      {contractRole && (
        <ContractRoleRow>
          <ContractRole>{contractRole}</ContractRole>
          {isCustody && <CustodyBadge />}
        </ContractRoleRow>
      )}
      <Text
        size="xxs"
        as="span"
        data-testid={getTestId(dataTestId, 'roleDescriptionText')}
      >
        {descriptionText}{' '}
        <NonBreakableText>
          {lastWord}
          <Tooltip placement="right" offset="xs" title={tooltip}>
            <WarningIcon />
          </Tooltip>
        </NonBreakableText>
      </Text>
    </RoleDescriptionWrapper>
  );
};
