import { Stake, Withdraw, Wrap } from '@lidofinance/lido-ui';
import { appPaths } from 'consts/routing';
import { type Address } from 'viem';
import { NavList, SelectedVaultWrapper } from '../styles';
import { useVaultInfo } from 'modules/vaults';
import { AddressBadge } from 'shared/components/address-badge';
import { useMemo } from 'react';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { NavigationLink } from '../navigation-link';
import { BackAllVaults } from '../back-all-vaults';

const vaultRoutes = (vaultAddress: Address, overrideMode?: any) => [
  {
    title: 'Overview',
    path: appPaths.vaults.vault(vaultAddress).overview,
    icon: <MosaicIcon />,
    exact: true,
  },
  {
    title: 'Supply/Withdraw',
    path: appPaths.vaults.vault(vaultAddress).supply(overrideMode ?? 'fund'),
    icon: <Stake />,
    exact: true,
  },
  {
    title: 'Mint/Repay stETH',
    path: appPaths.vaults
      .vault(vaultAddress)
      .adjustment(overrideMode ?? 'mint'),
    icon: <Withdraw />,
    exact: true,
  },
  {
    title: 'Validators',
    path: appPaths.vaults.vault(vaultAddress).validators,
    icon: <Wrap />,
    exact: true,
  },
  {
    title: 'Claim Fees',
    path: appPaths.vaults.vault(vaultAddress).claim,
    icon: <Withdraw />,
    exact: true,
  },
  {
    title: 'Settings',
    path: appPaths.vaults.vault(vaultAddress).settings,
    icon: <GearIcon />,
    exact: true,
  },
];

const vaultPathnames = vaultRoutes('[vaultAddress]' as any, '[mode]').map(
  ({ path }) => path,
);

export const VaultNavigation = () => {
  const { vaultAddress } = useVaultInfo();

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
        {availableRoutes.map(({ title, path, icon }, index) => (
          <NavigationLink
            icon={icon}
            title={title}
            path={path}
            key={path}
            customPathname={vaultPathnames[index]}
          />
        ))}
      </NavList>
    </>
  );
};
