import { FC } from 'react';

import { WarningIcon, RoleDescriptionWrapper } from './styles';

export interface RoleDescriptionProps {
  permission: string;
  description: string;
}

export const RoleDescription: FC<RoleDescriptionProps> = (props) => {
  const { description } = props;

  return (
    <RoleDescriptionWrapper>
      <span>{description}</span>
      <WarningIcon />
    </RoleDescriptionWrapper>
  );
};
