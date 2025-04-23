import { FC } from 'react';

import { Tooltip } from '@lidofinance/lido-ui';
import { WarningIcon, RoleDescriptionWrapper } from './styles';

export interface RoleDescriptionProps {
  permission: string;
  description: string;
  tooltip: string;
}

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description, tooltip } = props;

  return (
    <RoleDescriptionWrapper>
      <span>{description}</span>
      <Tooltip placement="right" offset="xs" title={tooltip}>
        <WarningIcon />
      </Tooltip>
    </RoleDescriptionWrapper>
  );
};
