import { FC, PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { Modal, Text, InlineLoader } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { formatPercent } from 'utils';

import {
  useOverviewModal,
  type OverviewModalItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { AmountLoader, AmountWrapper, ContentWrapper } from './styles';

type OverviewModalProps = {
  name: OverviewModalItem;
  symbol?: 'ETH' | 'stETH';
  amountRightDecorator?: ReactNode;
};

export const OverviewModal: FC<PropsWithChildren<OverviewModalProps>> = ({
  children = null,
  name,
  symbol = '',
  amountRightDecorator = null,
}) => {
  const { closeModal, currentModal } = useOverviewModal();

  const { isLoadingVault, getVaultDataToRender } = useVaultOverview();
  const { title, payload, hint, description, learnMoreLink } =
    getVaultDataToRender({ indicator: name });

  const formattedPayload =
    name === 'healthFactorNumber' ? (
      formatPercent.format(Number(payload) / 100)
    ) : typeof payload === 'bigint' ? (
      <FormatToken
        amount={payload}
        maxDecimalDigits={8}
        symbol={symbol}
        adaptiveDecimals
      />
    ) : (
      payload
    );

  const descriptionTextList: string[] = (description || hint || '').split(
    '\n\n',
  );

  return (
    <Modal
      title={title}
      open={name === currentModal}
      onClose={closeModal}
      windowSize="md"
      data-testid={`${name}-modal`}
    >
      <ContentWrapper>
        <AmountWrapper>
          {isLoadingVault ? (
            <AmountLoader />
          ) : (
            <>
              <Text size="lg" strong data-testid={`${name}-modal-amount`}>
                {formattedPayload || '-'}
              </Text>
              {amountRightDecorator}
            </>
          )}
        </AmountWrapper>
        {isLoadingVault ? (
          <InlineLoader />
        ) : (
          descriptionTextList.map((text, index) => (
            <Text
              key={text}
              size="xs"
              data-testid={`${name}-modal-descriptionText-${index}`}
            >
              {text}
            </Text>
          ))
        )}
        {children}
        {!isLoadingVault && learnMoreLink && (
          <Link
            href={learnMoreLink}
            data-testid={`${name}-modal-learnMoreLink`}
          >
            Learn more
          </Link>
        )}
      </ContentWrapper>
    </Modal>
  );
};
