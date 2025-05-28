import type { FC } from 'react';
import { FAQ, FAQComponentProps } from 'shared/components/faq';

export const FeeStructure: FC<FAQComponentProps> = ({ defaultExpanded }) => {
  return (
    <FAQ.Item title="Fee structure" defaultExpanded={defaultExpanded}>
      There are two main fees applied on the vault:
      <ul>
        <li>Node Operator Fee</li>
        <li>Lido Fees</li>
      </ul>
      <p>
        The validation rewards received by the vault are subject to the Node
        Operator Fee.
      </p>
      <p>
        Node Operator Fee is not therefore deducted from the rewards
        automatically, but remain part of validators balance and vault balance
        as they are received. The accumulated Node Operator Fee is counted and
        reported by the Oracle regularly, and locked for the withdrawal by the
        Vault Owner so that only Node Operator representative can claim it.
      </p>
      Lido fees consist of two potential parts depending on the stVault selected
      tier:
      <ul>
        <li>
          Infrastructure fee, charged for using the stVaults infrastructure.
          Calculated from the stVault’s total value.
        </li>
        <li>
          Liquidity fee, charged for actual liquidity usage. Calculated from the
          stETH liability.
        </li>
      </ul>
      <p>
        Lido fees amount is locked for the withdrawal by the Vault Owner and
        claimed automatically from the vault contract balance within the Oracle
        report applying.
      </p>
    </FAQ.Item>
  );
};
