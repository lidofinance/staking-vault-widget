import { FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import Link from 'next/link';
import { Modal, Text } from '@lidofinance/lido-ui';

import { FormatToken, FormatPercent } from 'shared/formatters';
import { InlineLoader } from 'shared/components';
import { isBigint } from 'utils';

import {
  useOverviewModal,
  type OverviewModalItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { AmountWrapper, ContentWrapper } from './styles';

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

  const formattedPayload = useMemo(() => {
    if (name === 'healthFactorNumber')
      return <FormatPercent value={payload as number} />;
    if (isBigint(payload))
      return (
        <FormatToken
          amount={payload}
          maxDecimalDigits={8}
          symbol={symbol}
          adaptiveDecimals
        />
      );

    return payload;
  }, [payload, name, symbol]);

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
          <InlineLoader isLoading={isLoadingVault} height={28}>
            <Text size="lg" strong data-testid={`${name}-modal-amount`}>
              {formattedPayload || '-'}
            </Text>
            {amountRightDecorator}
          </InlineLoader>
        </AmountWrapper>
        <InlineLoader isLoading={isLoadingVault}>
          {descriptionTextList.map((text, index) => (
            <Text
              key={text}
              size="xs"
              data-testid={`${name}-modal-descriptionText-${index}`}
            >
              {text}
            </Text>
          ))}
        </InlineLoader>
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
