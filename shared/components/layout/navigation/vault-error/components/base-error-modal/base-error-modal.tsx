import type { FC } from 'react';
import { Button, Modal } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults/consts';
import { ButtonLink } from 'shared/components/button-link';

import { ErrorModalContent } from '../styles';

const texts = vaultTexts.common;

export type BaseErrorModalProps = {
  errorMessage: string;
  isRetryable: boolean;
  onRefetch?: () => void;
};

export const BaseErrorModal: FC<BaseErrorModalProps> = ({
  errorMessage,
  isRetryable,
  onRefetch,
}) => {
  return (
    <Modal title={errorMessage} center open>
      <ErrorModalContent>
        {isRetryable && (
          <Button variant="outlined" onClick={onRefetch}>
            Try Again
          </Button>
        )}
        <ButtonLink href={appPaths.vaults.all}>
          {texts.links.goToAll}
        </ButtonLink>
      </ErrorModalContent>
    </Modal>
  );
};
