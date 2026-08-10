import { Text, Link } from '@lidofinance/lido-ui';

import { Step } from 'shared/components';
import { config } from 'config';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import { RecoverFeesContainer } from './styles';

const { docsOrigin } = config;
const docsLink = `${docsOrigin}/run-on-lido/stvaults/operational-and-management-guides/stvault-disconnect-guide#step-6-recover-node-operator-fees`;

export const RecoverFees = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.RECOVER_FEES);

  return (
    <Step {...stepProps} title="Recover undisbursed Node Operator fees">
      <RecoverFeesContainer>
        <Text size="xs">
          Undisbursed Node Operator fees are stored in the abandoned Dashboard
          contract after the stVault is disconnected.
        </Text>
        <Text size="xs">
          To transfer these fees from the Dashboard contract, please{' '}
          <Link href={docsLink}>follow the instruction.</Link>
        </Text>
      </RecoverFeesContainer>
    </Step>
  );
};
