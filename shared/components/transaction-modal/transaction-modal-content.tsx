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
import type { TransactionModalAction, TransactionModalState } from './types';
import { useRef, useState, type Dispatch } from 'react';

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

const Content = styled.div.attrs({
  'data-testid': 'txStage',
})`
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
      return state.details.errorTitle ?? 'Transaction error';
    case 'success':
      return state.details.actionCompleteText;
    default:
      return 'Transaction';
  }
};

const getModalSubTitle = (state: TransactionModalState) => {
  switch (state.stage) {
    case 'collecting':
    case 'signing':
      return state.details.baseDescriptionText;
    case 'awaiting':
      return state.details.awaitingDescriptionText;
    case 'error':
      return '';
    case 'success':
      return state.details.mainActionCompleteDescriptionText;
    default:
      return '';
  }
};

const getMainContent = (
  state: TransactionModalState,
  dispatchModal: Dispatch<TransactionModalAction>,
) => {
  const { transactionResult, renderSuccessContent, errorText } = state.details;
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
      if (!state.details.awaitingDescriptionText) {
        return (
          <Text color="secondary" size="xxs">
            Awaiting block confirmation
          </Text>
        );
      }
      return null;
    case 'success':
      return (
        renderSuccessContent &&
        transactionResult &&
        renderSuccessContent({
          result: transactionResult,
          closeModal: () => {
            dispatchModal({
              type: 'close',
            });
          },
        })
      );
    case 'error':
      return (
        <Text color="secondary" size="xxs">
          {errorText ?? 'Something went wrong'}
        </Text>
      );
    default:
      return null;
  }
};

const showEtherscanLink = (state: TransactionModalState) => {
  if (
    state.details.transactionId &&
    (state.stage === 'awaiting' ||
      state.stage === 'success' ||
      // on error only the tx with unknown status is kept
      state.stage === 'error')
  ) {
    if (state.isBatch) {
      return <TxLinkAA callId={state.details.transactionId} />;
    }
    return <TxLinkEtherscan txHash={state.details.transactionId as Hash} />;
  }
};

// One Retry per error: a second click on the same error (e.g. a double click, or a click
// while the retry is still validating before it opens a new modal session) is ignored,
// so it can't turn into another attempt. A new session (the retry itself) shows Retry again.
const RetryButton = ({ state }: { state: TransactionModalState }) => {
  const retriedSessionRef = useRef<number>();
  const [retriedSession, setRetriedSession] = useState<number>();

  if (!state.onRetry || state.stage !== 'error') return null;
  if (retriedSession === state.sessionId) return null;

  return (
    <ButtonLink
      onClick={() => {
        // the ref locks synchronously, before the re-render hides the button
        if (retriedSessionRef.current === state.sessionId) return;
        retriedSessionRef.current = state.sessionId;
        setRetriedSession(state.sessionId);
        state.onRetry?.();
      }}
    >
      Retry
    </ButtonLink>
  );
};

export const TransactionModalContent = () => {
  const { dispatchModal, ...state } = useTransactionModal();

  return (
    <Modal
      center
      titleIcon={getIconComponent(state)}
      title={<span data-testid="title">{getModalTitle(state)}</span>}
      subtitle={
        <span data-testid="description">{getModalSubTitle(state)}</span>
      }
      open={state.isOpen && state.stage !== 'none'}
      onClose={() => {
        dispatchModal({ type: 'close' });
      }}
    >
      <Content>
        {getMainContent(state, dispatchModal)}
        <div data-testid="footerHint">{showEtherscanLink(state)}</div>
        <RetryButton state={state} />
      </Content>
    </Modal>
  );
};
