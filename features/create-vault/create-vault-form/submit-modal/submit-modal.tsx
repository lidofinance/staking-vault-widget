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

const getIconComponent = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success) return Success;
  if (step === SubmitStepEnum.reject) return Error;
  return Loader;
};

const getModalTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.success) return 'New vault has been created';
  if (step === SubmitStepEnum.reject) return 'Wallet tx signature';
  return 'You are creating a new vault';
};

const getModalSubTitle = (step: SubmitStep) => {
  if (step === SubmitStepEnum.submitting) return 'Awaiting block confirmation';
  if (step === SubmitStepEnum.reject) return 'User denied transaction sinature';
  return '';
};

export const SubmitModal: FC<ModalProps> = () => {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { submitStep, handleCancelSubmit } = useCreateVaultFormData();
  const IconComponent = useMemo(
    () => getIconComponent(submitStep),
    [submitStep],
  );
  const title = getModalTitle(submitStep);
  const subtitle = getModalSubTitle(submitStep);

  const handleNavigateToVault = () => {
    // TODO: get vault address
    void router.push('/overview:id');
  };

  return (
    <Modal
      center
      open={isSubmitting}
      onClose={handleCancelSubmit}
      title={title}
      subtitle={subtitle}
      titleIcon={<IconComponent size="large" />}
    >
      <Content>
        {submitStep === SubmitStepEnum.confirming && (
          <Text color="secondary" size="xxs">
            Confirm this transaction in your wallet
          </Text>
        )}

        {submitStep === SubmitStepEnum.success && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to vault
          </Button>
        )}

        {/* TODO: replace condition by tx when got it*/}
        {submitStep === SubmitStepEnum.success ||
          (submitStep === SubmitStepEnum.submitting && (
            <Link target="_blank" href={'https://etherscan.io/'}>
              View on Etherscan
            </Link>
          ))}

        {submitStep === SubmitStepEnum.reject && <Link href="#">retry</Link>}
      </Content>
    </Modal>
  );
};
