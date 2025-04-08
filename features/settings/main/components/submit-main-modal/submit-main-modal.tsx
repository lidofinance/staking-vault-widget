import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { useMainSettingsData } from 'features/settings/main/contexts';

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

import { SubmittingMainFormStep } from 'features/settings/main/types';
import { SubmittingMainFormStepsEnum } from 'features/settings/main/consts';

const getIconComponent = (step: SubmittingMainFormStep) => {
  if (step === SubmittingMainFormStepsEnum.success)
    return <Success fill="var(--lido-color-success)" />;
  if (step === SubmittingMainFormStepsEnum.reject) return <Error />;
  if (step === SubmittingMainFormStepsEnum.error) return <Error />;
  return <Loader size="large" />;
};

const getModalTitle = (step: SubmittingMainFormStep) => {
  if (step === SubmittingMainFormStepsEnum.success)
    return 'New vault has been created';
  if (step === SubmittingMainFormStepsEnum.reject) return 'Wallet tx signature';
  if (step === SubmittingMainFormStepsEnum.error) return 'Simulation error';
  return 'You are creating a new vault';
};

const getModalSubTitle = (step: SubmittingMainFormStep) => {
  if (step === SubmittingMainFormStepsEnum.submitting)
    return 'Awaiting block confirmation';
  if (step === SubmittingMainFormStepsEnum.reject)
    return 'User denied transaction signature';
  if (step === SubmittingMainFormStepsEnum.error)
    return 'Got error when called contract simulation';
  return '';
};

export const SubmitMainModal: FC<ModalProps> = () => {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { submitStep, handleCancelSubmit } = useMainSettingsData();
  const { retryFire } = useFormControllerContext();
  const { step, address, tx } = submitStep ?? {};

  const iconComponent = useMemo(() => getIconComponent(step), [step]);
  const title = getModalTitle(step);
  const subtitle = getModalSubTitle(step);
  const isModalOpen =
    isSubmitting || (!!step && step !== SubmittingMainFormStepsEnum.edit);

  const handleNavigateToVault = () => {
    void router.push(`/${address}`);
  };

  return (
    <Modal
      center
      open={isModalOpen}
      onClose={handleCancelSubmit}
      title={title}
      subtitle={subtitle}
      titleIcon={iconComponent}
    >
      <Content>
        {(step === SubmittingMainFormStepsEnum.initiate ||
          step === SubmittingMainFormStepsEnum.confirming) && (
          <Text color="secondary" size="xxs">
            Confirm this transaction in your wallet
          </Text>
        )}

        {step === SubmittingMainFormStepsEnum.success && address && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to vault
          </Button>
        )}

        {(SubmittingMainFormStepsEnum.success === step ||
          SubmittingMainFormStepsEnum.submitting === step) &&
          tx && <TxLinkEtherscan txHash={tx} />}

        {step === SubmittingMainFormStepsEnum.reject && (
          <ButtonLink onClick={retryFire}>retry</ButtonLink>
        )}

        {step === SubmittingMainFormStepsEnum.error && (
          <ButtonLink onClick={handleCancelSubmit}>close</ButtonLink>
        )}
      </Content>
    </Modal>
  );
};
