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
  Link,
  Button,
} from '@lidofinance/lido-ui';

import { SubmitStepEnum, SubmitStep } from 'features/create-vault/types';
import { Content } from './styles';
import { TxLinkEtherscan } from '../../../../shared/components/tx-link-etherscan';
import { useFormControllerContext } from '../../../../shared/hook-form/form-controller';

const getIconComponent = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success)
    return <Success fill="var(--lido-color-success)" />;
  if (step === SubmitStepEnum.reject) return <Error />;
  return <Loader size="large" />;
};

const getModalTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success) return 'New vault has been created';
  if (step === SubmitStepEnum.reject) return 'Wallet tx signature';
  return 'You are creating a new vault';
};

const getModalSubTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.submitting) return 'Awaiting block confirmation';
  if (step === SubmitStepEnum.reject)
    return 'User denied transaction signature';
  return '';
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
    void router.push(`/overview/${address}`);
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
          <Link target="_self" onClick={retryFire} href="#">
            retry
          </Link>
        )}
      </Content>
    </Modal>
  );
};
