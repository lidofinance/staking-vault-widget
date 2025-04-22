export const populateRpcUrls = () => {
  return [`1`, ...(process.env.SUPPORTED_CHAINS?.split(',') ?? [])].reduce(
    (acc, chain) => {
      acc[`rpcUrls_${chain}`] = process.env[`EL_RPC_URLS_${chain}`];
      return acc;
    },
    {},
  );
};
