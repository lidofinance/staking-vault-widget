import { type FC, useMemo } from 'react';
import { Tooltip, Text } from '@lidofinance/lido-ui';

import { ROLES_TO_CONTRACT_CONSTANT } from 'modules/vaults';
import { getTestId } from 'utils';

import {
  WarningIcon,
  RoleDescriptionWrapper,
  ContractRole,
  NonBreakableText,
} from './styles';

export type RoleDescriptionProps = {
  description: string;
  tooltip: string;
  contractRole?: (typeof ROLES_TO_CONTRACT_CONSTANT)[keyof typeof ROLES_TO_CONTRACT_CONSTANT];
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
    descriptionText: words.toSpliced(0, -1).join(' '),
    lastWord: words.at(-1) ?? '',
  };
};

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description, tooltip, dataTestId, contractRole } = props;
  const { descriptionText, lastWord } = useMemo(
    () => splitDescription(description),
    [description],
  );

  return (
    <RoleDescriptionWrapper
      data-testid={getTestId(dataTestId, 'roleDescriptionWrapper')}
    >
      {contractRole && <ContractRole>{contractRole}</ContractRole>}
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
