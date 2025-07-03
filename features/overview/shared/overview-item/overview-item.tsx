import type { FC, PropsWithChildren } from 'react';
import type { Address } from 'viem';
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
} from 'features/overview/components/modals';
import type { SectionPayload } from 'features/overview/contexts';
import { useOverviewModal } from 'features/overview/hooks';
import type { VaultOverviewModalKey } from 'features/overview/types';

import { OverviewItemValue } from './overview-item-value';
import { DefaultContent, ItemWrapper, Title } from './styles';

export type ItemProps = {
  payload: string | Address | number | boolean;
  indicator: VaultOverviewModalKey;
  titleView?: 'column' | 'row';
  color?: string;
} & Omit<SectionPayload, 'key'>;

const modalsMap: Record<VaultOverviewModalKey, FC> = {
  totalValue: TotalValueModal,
  healthFactorNumber: HealthFactorModal,
  netApr: NetAprModal,
  liabilityStETH: StethLiabilityModal,
  balanceEth: VaultBalanceModal,
  withdrawableEth: ImmediateWithdrawalModal,
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

  return (
    <ItemWrapper onClick={() => openModal(indicator)}>
      <DefaultContent titleView={titleView}>
        <Title>
          <Text color="secondary" size="xxs">
            {title}
          </Text>
          <Hint text={hint} />
        </Title>
        <OverviewItemValue
          content={payload}
          isLoading={isLoading}
          color={color}
          {...rest}
        />
      </DefaultContent>
      {children}
      {!!ModalComponent && <ModalComponent />}
    </ItemWrapper>
  );
};
