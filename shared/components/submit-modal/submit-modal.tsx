import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';

import {
  Loader,
  Modal,
  Text,
  Success,
  Error,
  type ModalProps,
  Button,
} from '@lidofinance/lido-ui';

import { useFormControllerContext } from 'shared/hook-form/form-controller';
import { ButtonLink, TxLinkEtherscan } from 'shared/components';
import { Content } from './styles';

import {
  SubmitStepEnum,
  SubmitStep,
} from 'shared/components/submit-modal/types';
import { AppPaths } from 'consts/urls';
import { useVaultInfo } from 'features/overview/contexts';
import { Address } from 'viem';

const getIconComponent = (step: SubmitStep) => {
  switch (step) {
    case SubmitStepEnum.success:
      return <Success fill="var(--lido-color-success)" />;
    case SubmitStepEnum.reject:
      return <Error />;
    case SubmitStepEnum.error:
      return <Error />;
    default:
      return <Loader size="large" />;
  }
};

const getModalTitle = (step: SubmitStep) => {
  switch (step) {
    case SubmitStepEnum.simulating:
      return 'Simulation';
    case SubmitStepEnum.success:
      return 'Transaction was finished successfully';
    case SubmitStepEnum.reject:
      return 'Wallet tx signature';
    case SubmitStepEnum.error:
      return 'Transaction error';
    default:
      return 'Transaction';
  }
};

const getModalSubTitle = (step: SubmitStep) => {
  switch (step) {
    case SubmitStepEnum.simulating:
      return 'Awaiting simulating transaction(s)';
    case SubmitStepEnum.confirming:
      return 'Awaiting wallet signature';
    case SubmitStepEnum.submitting:
      return 'Awaiting block confirmation';
    case SubmitStepEnum.reject:
      return 'User denied transaction signature';
    case SubmitStepEnum.error:
      return 'Got error when called contract simulation or transaction';
    default:
      return '';
  }
};

interface SubmitModalProps extends ModalProps {
  submitStep: {
    step: SubmitStep;
    tx?: Address;
  };
  setModalState: ({ step }: { step: SubmitStep }) => void;
  onClose?: () => void;
}

export const SubmitModal: FC<SubmitModalProps> = ({
  submitStep,
  setModalState,
  onClose,
}) => {
  const router = useRouter();
  const {
    formState: { isSubmitting, isSubmitted },
  } = useFormContext();
  const { retryFire } = useFormControllerContext();
  const { step, tx } = submitStep ?? {};
  const { activeVault } = useVaultInfo();

  const iconComponent = useMemo(() => getIconComponent(step), [step]);
  const title = getModalTitle(step);
  const subtitle = getModalSubTitle(step);

  const handleNavigateToVault = () => {
    void router.push(`/${activeVault?.address}/${AppPaths.overview}`);
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    } else {
      handlePureCloseModal();
    }
  };

  const handlePureCloseModal = () => {
    setModalState({ step: SubmitStepEnum.edit });
  };

  return (
    <Modal
      center
      open={(isSubmitting || isSubmitted) && step !== SubmitStepEnum.edit}
      onClose={handleCloseModal}
      title={title}
      subtitle={subtitle}
      titleIcon={iconComponent}
    >
      <Content>
        {step === SubmitStepEnum.initiate && (
          <Text color="secondary" size="xxs">
            Wait for wallet confirmation window
          </Text>
        )}

        {step === SubmitStepEnum.confirming && (
          <Text color="secondary" size="xxs">
            Confirm this transaction in your wallet
          </Text>
        )}

        {step === SubmitStepEnum.overview && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to dashboard
          </Button>
        )}

        {step === SubmitStepEnum.success && (
          <Button onClick={handlePureCloseModal} fullwidth>
            Close modal
          </Button>
        )}

        {(SubmitStepEnum.success === step ||
          SubmitStepEnum.submitting === step) &&
          tx && <TxLinkEtherscan txHash={tx} />}

        {step === SubmitStepEnum.reject && (
          <ButtonLink onClick={retryFire}>retry</ButtonLink>
        )}

        {step === SubmitStepEnum.error && (
          <ButtonLink onClick={handleCloseModal}>close</ButtonLink>
        )}
      </Content>
    </Modal>
  );
};
