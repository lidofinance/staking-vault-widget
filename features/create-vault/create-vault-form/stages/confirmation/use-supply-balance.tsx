import { useAA, useEthereumBalance } from 'modules/web3';
import { VAULTS_CONNECT_DEPOSIT } from 'modules/vaults';

export const useSupplyBalance = () => {
  const { areAuxiliaryFundsSupported } = useAA();
  const { data: ethBalance, isLoading: ethBalanceLoading } =
    useEthereumBalance();

  // if auxiliary funds are supported, we don't need to check ETH balance
  if (areAuxiliaryFundsSupported) {
    return {
      isLoading: false,
      hasEnoughETH: true,
    };
  }

  const hasEnoughETH =
    areAuxiliaryFundsSupported ||
    !!(ethBalance && ethBalance >= VAULTS_CONNECT_DEPOSIT);

  return {
    isLoading: ethBalanceLoading,
    hasEnoughETH,
  };
};
