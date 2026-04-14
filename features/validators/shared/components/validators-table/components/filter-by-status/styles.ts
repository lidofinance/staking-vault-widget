import styled from 'styled-components';
import { Select, Option } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';
import type { ValidatorStatus } from 'modules/vaults';

import { getValidatorStatusTextColor } from 'features/validators/utils';

export const SelectStyled = styled(Select)`
  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;

export const OptionStyled = styled(Option)<{ $status: ValidatorStatus }>`
  color: ${getValidatorStatusTextColor};
`;
