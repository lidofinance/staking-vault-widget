import { Text, Link } from '@lidofinance/lido-ui';

import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import { RecoverFeesContainer } from './styles';

export const RecoverFees = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.RECOVER_FEES);

  // TODO: add link for docs
  return (
    <Step {...stepProps} title="Recover undisbursed Node Operator fees">
      <RecoverFeesContainer>
        <Text size="xs">
          Undisbursed Node Operator fees are stored in the abandoned Dashboard
          contract after the stVault is disconnected.
        </Text>
        <Text size="xs">
          To transfer these fees from the Dashboard contract, please{' '}
          <Link href="#">follow the instruction.</Link>
        </Text>
      </RecoverFeesContainer>
    </Step>
  );
};
