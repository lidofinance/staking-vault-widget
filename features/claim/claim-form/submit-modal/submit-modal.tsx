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

import { SubmitStepEnum, SubmitStep } from 'shared/transaction-modal/types';
import { AppPaths } from 'consts/urls';
import { useVaultInfo } from 'features/overview/contexts';
import { Address } from 'viem';

const getIconComponent = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success)
    return <Success fill="var(--lido-color-success)" />;
  if (step === SubmitStepEnum.reject) return <Error />;
  if (step === SubmitStepEnum.error) return <Error />;
  return <Loader size="large" />;
};

const getModalTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success) return 'Fees was getting successfully';
  if (step === SubmitStepEnum.reject) return 'Wallet tx signature';
  if (step === SubmitStepEnum.error) return 'Transaction error';
  return 'You are requesting fees';
};

const getModalSubTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.submitting) return 'Awaiting wallet signature';
  if (step === SubmitStepEnum.reject)
    return 'User denied transaction signature';
  if (step === SubmitStepEnum.error)
    return 'Got error when called contract simulation or transaction';
  return '';
};

interface SubmitModalProps extends ModalProps {
  submitStep: {
    step: SubmitStep;
    tx?: Address;
  };
  setModalState: ({ step }: { step: SubmitStep }) => void;
}

export const SubmitModal: FC<SubmitModalProps> = ({
  submitStep,
  setModalState,
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

        {step === SubmitStepEnum.success && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to dashboard
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
