import { type FC } from 'react';
import { Tooltip, Text } from '@lidofinance/lido-ui';

import { ROLES_TO_CONTRACT_CONSTANT } from 'modules/vaults';
import { WarningIcon, RoleDescriptionWrapper, ContractRole } from './styles';

export type RoleDescriptionProps = {
  description: string;
  tooltip: string;
  contractRole?: (typeof ROLES_TO_CONTRACT_CONSTANT)[keyof typeof ROLES_TO_CONTRACT_CONSTANT];
  dataTestId?: string;
};

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description, tooltip, dataTestId, contractRole } = props;

  return (
    <RoleDescriptionWrapper
      data-testid={
        dataTestId ? `${dataTestId}-roleDescriptionWrapper` : undefined
      }
    >
      {contractRole && <ContractRole>{contractRole}</ContractRole>}
      <Text
        size="xxs"
        as="span"
        data-testid={
          dataTestId ? `${dataTestId}-roleDescriptionText` : undefined
        }
      >
        {description}
      </Text>
      <Tooltip placement="right" offset="xs" title={tooltip}>
        <WarningIcon />
      </Tooltip>
    </RoleDescriptionWrapper>
  );
};
