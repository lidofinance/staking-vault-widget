import { type FC, type PropsWithChildren, useCallback } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { Hint } from 'shared/components';

import {
  HealthFactorModal,
  ImmediateWithdrawalModal,
  TotalValueModal,
  LidoFeeModal,
  NetAprModal,
  NodeOperatorFeeModal,
  StethLiabilityModal,
  VaultBalanceModal,
} from 'features/overview/content/modals';

import {
  useOverviewModal,
  type SectionPayload,
  type VaultOverviewModalKey,
} from 'features/overview/inner';

import { OverviewItemValue } from './overview-item-value';
import { DefaultContent, ItemWrapper, Title } from './styles';

export type ItemProps = {
  payload?: string | number | boolean | bigint;
  indicator: VaultOverviewModalKey;
  titleView?: 'column' | 'row';
  color?: string;
  symbol?: 'ETH' | 'stETH';
} & Omit<SectionPayload, 'key'>;

const modalsMap: Record<VaultOverviewModalKey, FC> = {
  totalValueETH: TotalValueModal,
  healthFactorNumber: HealthFactorModal,
  netApr: NetAprModal,
  vaultLiabilityStETH: StethLiabilityModal,
  balance: VaultBalanceModal,
  withdrawableEther: ImmediateWithdrawalModal,
  undisbursedNodeOperatorFee: NodeOperatorFeeModal,
  unsettledLidoFees: LidoFeeModal,
};

const getModalComponent = (name: VaultOverviewModalKey) => {
  return modalsMap[name];
};

export const OverviewItem: FC<PropsWithChildren<ItemProps>> = ({
  title,
  payload,
  hint,
  isLoading,
  color,
  indicator,
  titleView = 'column',
  children,
  ...rest
}) => {
  const { openModal } = useOverviewModal();
  const ModalComponent = getModalComponent(indicator);

  const handleOpenModal = useCallback(async () => {
    await openModal(indicator);
  }, [openModal, indicator]);

  return (
    <>
      <ItemWrapper data-testid={`${indicator}`} onClick={handleOpenModal}>
        <DefaultContent titleView={titleView}>
          <Title>
            <Text data-testid="blockTitle" color="secondary" size="xxs">
              {title}
            </Text>
            <Hint data-testid="tooltip" text={hint} />
          </Title>
          <OverviewItemValue
            content={payload}
            isLoading={isLoading}
            color={color}
            {...rest}
          />
        </DefaultContent>
        {children}
      </ItemWrapper>
      <ModalComponent />
    </>
  );
};
