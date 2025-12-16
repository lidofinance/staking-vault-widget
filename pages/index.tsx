import { config } from 'config';
import { appPaths } from 'consts/routing';
import { MyVaultsPage } from 'features/home';
import { HomePageIpfs } from 'features/ipfs';

import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export default config.ipfsMode ? HomePageIpfs : MyVaultsPage;

export const getStaticProps = getDefaultStaticProps(appPaths.myVaults);
