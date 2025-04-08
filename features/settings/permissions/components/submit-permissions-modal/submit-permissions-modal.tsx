import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useFormContext } from 'react-hook-form';
import { usePermissionsSettingsData } from 'features/settings/permissions/contexts';

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

import { SubmitPermissionsStep } from 'features/settings/permissions/types';
import { SubmitPermissionsStepEnum } from 'features/settings/permissions/consts';

const getIconComponent = (step: SubmitPermissionsStep) => {
  if (step === SubmitPermissionsStepEnum.success)
    return <Success fill="var(--lido-color-success)" />;
  if (step === SubmitPermissionsStepEnum.reject) return <Error />;
  if (step === SubmitPermissionsStepEnum.error) return <Error />;
  return <Loader size="large" />;
};

const getModalTitle = (step: SubmitPermissionsStep) => {
  if (step === SubmitPermissionsStepEnum.success)
    return 'New vault has been created';
  if (step === SubmitPermissionsStepEnum.reject) return 'Wallet tx signature';
  if (step === SubmitPermissionsStepEnum.error) return 'Simulation error';
  return 'You are creating a new vault';
};

const getModalSubTitle = (step: SubmitPermissionsStep) => {
  if (step === SubmitPermissionsStepEnum.submitting)
    return 'Awaiting block confirmation';
  if (step === SubmitPermissionsStepEnum.reject)
    return 'User denied transaction signature';
  if (step === SubmitPermissionsStepEnum.error)
    return 'Got error when called contract simulation';
  return '';
};

export const SubmitPermissionsModal: FC<ModalProps> = () => {
  const router = useRouter();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { submitStep, handleCancelSubmit } = usePermissionsSettingsData();
  const { retryFire } = useFormControllerContext();
  const { step, address, tx } = submitStep ?? {};

  const iconComponent = useMemo(() => getIconComponent(step), [step]);
  const title = getModalTitle(step);
  const subtitle = getModalSubTitle(step);
  const isModalOpen =
    isSubmitting || (!!step && step !== SubmitPermissionsStepEnum.edit);

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
        {(step === SubmitPermissionsStepEnum.initiate ||
          step === SubmitPermissionsStepEnum.confirming) && (
          <Text color="secondary" size="xxs">
            Confirm this transaction in your wallet
          </Text>
        )}

        {step === SubmitPermissionsStepEnum.success && address && (
          <Button onClick={handleNavigateToVault} fullwidth>
            Go to vault
          </Button>
        )}

        {(SubmitPermissionsStepEnum.success === step ||
          SubmitPermissionsStepEnum.submitting === step) &&
          tx && <TxLinkEtherscan txHash={tx} />}

        {step === SubmitPermissionsStepEnum.reject && (
          <ButtonLink onClick={retryFire}>retry</ButtonLink>
        )}

        {step === SubmitPermissionsStepEnum.error && (
          <ButtonLink onClick={handleCancelSubmit}>close</ButtonLink>
        )}
      </Content>
    </Modal>
  );
};
