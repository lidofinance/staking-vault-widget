import styled from 'styled-components';
import { Select, Option, SelectProps } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';
import type { ValidatorStatus } from 'modules/vaults';

import { getValidatorStatusTextColor } from 'features/validators/utils';

type SelectStyledProps = {
  $status: ValidatorStatus | undefined;
} & SelectProps;

export const SelectStyled = styled(Select)<SelectStyledProps>`
  & input {
    color: ${getValidatorStatusTextColor};
  }

  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;

export const OptionStyled = styled(Option)<{ $status: ValidatorStatus }>`
  color: ${getValidatorStatusTextColor};
`;
