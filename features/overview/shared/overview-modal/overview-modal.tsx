import { FC, PropsWithChildren, ReactNode } from 'react';
import Link from 'next/link';
import { Modal, Text, InlineLoader } from '@lidofinance/lido-ui';

import { formatPercent } from 'utils';

import {
  useOverviewModal,
  type OverviewModalItem,
} from 'features/overview/inner';
import { useVaultOverview } from 'features/overview/vault-overview';

import { AmountLoader, AmountWrapper, ContentWrapper } from './styles';

type OverviewModalProps = {
  name: OverviewModalItem;
  amountRightDecorator?: ReactNode;
};

export const OverviewModal: FC<PropsWithChildren<OverviewModalProps>> = ({
  children = null,
  name,
  amountRightDecorator = null,
}) => {
  const { closeModal, currentModal } = useOverviewModal();

  const { isLoadingVault, getVaultDataToRender } = useVaultOverview();
  const { title, payload, hint, description, learnMoreLink } =
    getVaultDataToRender({ indicator: name });
  const isHealthFactor = name === 'healthFactorNumber';
  const formattedPayload = isHealthFactor
    ? formatPercent.format(Number(payload) / 100)
    : typeof payload === 'bigint'
      ? payload.toString()
      : payload;

  const descriptionTextList: string[] = (description || hint || '').split(
    '\n\n',
  );

  return (
    <Modal
      title={title}
      open={name === currentModal}
      onClose={closeModal}
      windowSize="md"
    >
      <ContentWrapper>
        <AmountWrapper>
          {isLoadingVault ? (
            <AmountLoader />
          ) : (
            <>
              <Text size="lg" strong>
                {formattedPayload || '-'}
              </Text>
              {amountRightDecorator}
            </>
          )}
        </AmountWrapper>
        {isLoadingVault ? (
          <InlineLoader />
        ) : (
          descriptionTextList.map((text) => (
            <Text key={text} size="xs">
              {text}
            </Text>
          ))
        )}
        {children}
        {!isLoadingVault && learnMoreLink && (
          <Link href={learnMoreLink}>Learn more</Link>
        )}
      </ContentWrapper>
    </Modal>
  );
};
