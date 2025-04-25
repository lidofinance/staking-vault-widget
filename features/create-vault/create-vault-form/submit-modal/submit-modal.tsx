import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

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

import { SubmitStepEnum, SubmitStep } from 'features/create-vault/types';
import { AppPaths } from 'consts/urls';

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
    case SubmitStepEnum.success:
      return 'New vault has been created';
    case SubmitStepEnum.reject:
      return 'Wallet tx signature';
    case SubmitStepEnum.error:
      return 'Simulation error';
    default:
      return 'You are creating a new vault';
  }
};

const getModalSubTitle = (step: SubmitStep) => {
  switch (step) {
    case SubmitStepEnum.submitting:
      return 'Awaiting wallet signature';
    case SubmitStepEnum.reject:
      return 'User denied transaction signature';
    case SubmitStepEnum.error:
      return 'Got error when called contract simulation';
    default:
      return '';
  }
};

export const SubmitModal: FC<ModalProps> = () => {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { submitStep, handleCancelSubmit } = useCreateVaultFormData();
  const { retryFire } = useFormControllerContext();
  const { step, address, tx } = submitStep ?? {};

  const iconComponent = useMemo(() => getIconComponent(step), [step]);
  const title = getModalTitle(step);
  const subtitle = getModalSubTitle(step);

  const handleNavigateToVault = () => {
    // TODO: add for responsive buttons onClick = () => Promise and handle promise there
    void router.push(`/${address}/${AppPaths.overview}`);
  };

  return (
    <Modal
      center
      open={isSubmitting || !!step}
      onClose={handleCancelSubmit}
      title={title}
      subtitle={subtitle}
      titleIcon={iconComponent}
    >
      <Content>
        {(step === SubmitStepEnum.initiate ||
          step === SubmitStepEnum.confirming) && (
          <Text color="secondary" size="xxs">
            Confirm this transaction in your wallet
          </Text>
        )}

        {step === SubmitStepEnum.success && address && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to vault
          </Button>
        )}

        {(SubmitStepEnum.success === step ||
          SubmitStepEnum.submitting === step) &&
          tx && <TxLinkEtherscan txHash={tx} />}

        {step === SubmitStepEnum.reject && (
          <ButtonLink onClick={retryFire}>retry</ButtonLink>
        )}

        {step === SubmitStepEnum.error && (
          <ButtonLink onClick={handleCancelSubmit}>close</ButtonLink>
        )}
      </Content>
    </Modal>
  );
};
