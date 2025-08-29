import { useMemo } from 'react';
import { type Address } from 'viem';
import { Stake, Withdraw, External } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { AddressBadge } from 'shared/components/address-badge';
import { appPaths } from 'consts/routing';

import { NavigationLink } from '../navigation-link';
import { BackAllVaults } from '../back-all-vaults';
import { NavList, SelectedVaultWrapper } from '../styles';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { VaultError } from '../vault-error';

const vaultRoutes = (vaultAddress: Address, overrideMode?: any) => [
  {
    title: 'Overview',
    path: appPaths.vaults.vault(vaultAddress).overview,
    icon: <MosaicIcon />,
    exact: true,
  },
  {
    title: 'Supply/Withdraw',
    path: appPaths.vaults.vault(vaultAddress).eth(overrideMode ?? 'supply'),
    icon: <Stake />,
    exact: true,
  },
  {
    title: 'Mint/Repay stETH',
    path: appPaths.vaults.vault(vaultAddress).steth(overrideMode ?? 'mint'),
    icon: <Withdraw />,
    exact: true,
  },
  {
    title: 'Validators',
    path: 'https://hoodi.beaconcha.in/validators/deposits?q=',
    icon: <External />,
    exact: true,
    external: true,
  },
  {
    title: 'Claim Fees',
    path: appPaths.vaults.vault(vaultAddress).claim,
    icon: <Withdraw />,
    exact: true,
  },
  {
    title: 'Settings',
    path: appPaths.vaults.vault(vaultAddress).settings(overrideMode || 'main'),
    icon: <GearIcon />,
    exact: true,
  },
];

const vaultPathnames = vaultRoutes('[vaultAddress]' as any, '[mode]').map(
  ({ path }) => path,
);

export const VaultNavigation = () => {
  const { vaultAddress, activeVault } = useVault();

  const availableRoutes = useMemo(
    () => (vaultAddress ? vaultRoutes(vaultAddress) : []),
    [vaultAddress],
  );

  return (
    <>
      <BackAllVaults />
      <SelectedVaultWrapper>
        <AddressBadge
          bgColor="transparent"
          address={vaultAddress}
          symbols={5}
        />
      </SelectedVaultWrapper>
      <NavList>
        {availableRoutes.map(({ title, path, icon, external }, index) => {
          const isValidatorsLink = title === 'Validators';
          const validatorsPath =
            isValidatorsLink && activeVault
              ? `${path}${activeVault?.withdrawalCredentials}`
              : path;

          return (
            <NavigationLink
              icon={icon}
              title={title}
              path={validatorsPath}
              key={path}
              customPathname={vaultPathnames[index]}
              external={external}
            />
          );
        })}
      </NavList>
      <VaultError />
    </>
  );
};
