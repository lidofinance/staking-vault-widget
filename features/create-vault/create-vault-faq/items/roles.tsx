import type { FC } from 'react';
import { FAQ, FAQComponentProps } from 'shared/components/faq';

export const Roles: FC<FAQComponentProps> = ({ defaultExpanded }) => {
  return (
    <FAQ.Item title="Roles" defaultExpanded={defaultExpanded}>
      There are three main roles in the stVault:
      <ol>
        <li>
          <strong>Node Operator</strong> provides validation service for the
          vault: handles depositing ETH from the vault balance to validators and
          exiting validators if necessary. Address of the Node Operator can’t be
          changed after the vault is created.
        </li>
        <li>
          <strong>Vault Owner</strong> is one of the two admin roles for the
          stVault, allows to manage permissions and change key vault parameters
          from the Vault Owner (Staker) perspective. Multiple addresses
          supported.
        </li>
        <li>
          <strong>Node Operator Manager</strong> is another of the two admin
          roles for the stVault, allows to manage permissions and change key
          vault parameters from the Node Operator perspective. Multiple
          addresses supported.
        </li>
      </ol>
    </FAQ.Item>
  );
};
