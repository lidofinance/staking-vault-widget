import { FC, PropsWithChildren, ReactNode, useCallback } from 'react';
import Link from 'next/link';
import { Modal, Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVaultInfo } from 'modules/vaults';
import { formatPercent } from 'utils';

import { useVaultOverview } from 'features/overview/contexts';
import { useOverviewModal } from 'features/overview/hooks';
import type { OverviewModalItem } from 'features/overview/types';

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
  const { isLoadingVault } = useVaultInfo();
  const { getVaultDataToRender } = useVaultOverview();
  const { title, payload, hint, description, learnMoreLink } =
    getVaultDataToRender({ indicator: name });
  const isHealthFactor = name === 'healthFactorNumber';
  const formattedPayload = isHealthFactor
    ? formatPercent.format(Number(payload) / 100)
    : payload;

  const descriptionTextList: string[] = (description || hint || '').split(
    '\n\n',
  );

  const onClose = useCallback(
    (...args: unknown[]) => {
      args.forEach((arg) => {
        // ui lib returns event for crossed button but in doest declare in d.ts
        if (
          typeof arg === 'object' &&
          arg &&
          'preventDefault' in arg &&
          typeof arg.preventDefault === 'function'
        ) {
          arg.preventDefault();
        }

        if (
          typeof arg === 'object' &&
          arg &&
          'stopPropagation' in arg &&
          typeof arg.stopPropagation === 'function'
        ) {
          arg.stopPropagation();
        }
      });

      closeModal();
    },
    [closeModal],
  );

  return (
    <Modal title={title} open={name === currentModal} onClose={onClose}>
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
