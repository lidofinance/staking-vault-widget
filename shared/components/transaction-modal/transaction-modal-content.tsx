import styled from 'styled-components';
import {
  Loader,
  Modal,
  Success,
  Error as ErrorIcon,
  Text,
} from '@lidofinance/lido-ui';

import { useTransactionModal } from './transaction-modal';
import { TxLinkAA, TxLinkEtherscan } from '../tx-link-etherscan';
import { ButtonLink } from '../button-link';

import type { Hash } from 'viem';
import type { TransactionModalState } from './types';

const getIconComponent = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
    case 'signing':
    case 'awaiting':
    default:
      return <Loader size="large" />;
    case 'success':
      return <Success fill="var(--lido-color-success)" />;
    case 'error':
      return <ErrorIcon />;
  }
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;

const getModalTitle = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
    case 'signing':
    case 'awaiting':
      return state.details.actionLoadingText;
    case 'error':
      return 'Transaction error';
    case 'success':
      return state.details.actionCompleteText;
    default:
      return 'Transaction';
  }
};

const getMainContent = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
      return (
        <Text color="secondary" size="xxs">
          Fetching transaction data
        </Text>
      );
    case 'signing':
      return (
        <Text color="secondary" size="xxs">
          Confirm this transaction in your wallet
        </Text>
      );
    case 'awaiting':
      return (
        <Text color="secondary" size="xxs">
          Awaiting block confirmation
        </Text>
      );
    case 'success':
      return state.details.renderSuccessContent?.() ?? null;
    case 'error':
      return (
        <Text color="secondary" size="xxs">
          {state.details.errorText ?? 'Something went wrong'}
        </Text>
      );
    default:
      return null;
  }
};

const showEtherscanLink = (state: TransactionModalState) => {
  if (
    state.details.transactionId &&
    (state.stage === 'awaiting' || state.stage === 'success')
  ) {
    if (state.isBatch) {
      return <TxLinkAA callId={state.details.transactionId} />;
    }
    return <TxLinkEtherscan txHash={state.details.transactionId as Hash} />;
  }
};

const showRetryButton = (state: TransactionModalState) => {
  if (state.onRetry && state.stage === 'error') {
    return (
      <ButtonLink
        onClick={() => {
          state.onRetry?.();
        }}
      >
        Retry
      </ButtonLink>
    );
  }
};

export const TransactionModalContent = () => {
  const { dispatchModal, ...state } = useTransactionModal();
  return (
    <Modal
      center
      titleIcon={getIconComponent(state)}
      title={getModalTitle(state)}
      open={state.isOpen && state.stage !== 'none'}
      onClose={() => {
        dispatchModal({ type: 'close' });
      }}
    >
      <Content>
        {getMainContent(state)}
        {showEtherscanLink(state)}
        {showRetryButton(state)}
      </Content>
    </Modal>
  );
};
