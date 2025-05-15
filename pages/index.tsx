import { config } from 'config';
import { appPaths } from 'consts/routing';
import { HomePage } from 'features/home';
import { HomePageIpfs } from 'features/ipfs';

import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export default config.ipfsMode ? HomePageIpfs : HomePage;

export const getStaticProps = getDefaultStaticProps(appPaths.myVaults);
