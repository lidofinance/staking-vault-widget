import { FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useMainSettingsData } from 'features/settings/main/contexts';

import {
  Loader,
  Modal,
  Text,
  Success,
  Error,
  type ModalProps,
} from '@lidofinance/lido-ui';

import { useFormControllerContext } from 'shared/hook-form/form-controller';
import { ButtonLink, TxLinkEtherscan } from 'shared/components';
import { Content, TxListWrapper } from './styles';

import { SubmittingMainFormStep, TxData } from 'features/settings/main/types';
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
    return 'Vault has been updated successfully!';
  if (step === SubmittingMainFormStepsEnum.reject) return 'Wallet tx signature';
  if (step === SubmittingMainFormStepsEnum.error) return 'Simulation error';
  return 'You are updating the vault';
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

const keyTitleMap: Record<keyof TxData, string> = {
  confirmExpiry: 'View confirmation lifetime tx on Etherscan',
  nodeOperatorFeeBP: 'View node operator fee tx on Etherscan',
  roles: 'View roles updates tx on Etherscan',
};

export const SubmitMainModal: FC<ModalProps> = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const { submitStep, handleCancelSubmit } = useMainSettingsData();
  const { retryFire } = useFormControllerContext();
  const { step, response } = submitStep ?? {};

  const iconComponent = useMemo(() => getIconComponent(step), [step]);
  const title = getModalTitle(step);
  const subtitle = getModalSubTitle(step);
  const isModalOpen =
    isSubmitting || (!!step && step !== SubmittingMainFormStepsEnum.edit);

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

        {SubmittingMainFormStepsEnum.success === step && response && (
          <TxListWrapper>
            {response.map(({ tx, key }) => (
              <TxLinkEtherscan key={tx} txHash={tx} text={keyTitleMap[key]} />
            ))}
          </TxListWrapper>
        )}

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
