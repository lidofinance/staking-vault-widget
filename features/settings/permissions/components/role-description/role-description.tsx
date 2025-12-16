import { FC } from 'react';

import { Tooltip } from '@lidofinance/lido-ui';
import { WarningIcon, RoleDescriptionWrapper } from './styles';

export interface RoleDescriptionProps {
  description: string;
  tooltip: string;
  dataTestId?: string;
}

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description, tooltip, dataTestId } = props;

  return (
    <RoleDescriptionWrapper
      data-testid={
        dataTestId ? `${dataTestId}-roleDescriptionWrapper` : undefined
      }
    >
      <span
        data-testid={
          dataTestId ? `${dataTestId}-roleDescriptionText` : undefined
        }
      >
        {description}
      </span>
      <Tooltip placement="right" offset="xs" title={tooltip}>
        <WarningIcon />
      </Tooltip>
    </RoleDescriptionWrapper>
  );
};
