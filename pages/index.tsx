import { config } from 'config';
import { HomePage } from 'features/home';
import { HomePageIpfs } from 'features/ipfs';

import { getDefaultStaticProps } from 'utilsApi/get-default-static-props';

export const getStaticProps = getDefaultStaticProps('/');

export default config.ipfsMode ? HomePageIpfs : HomePage;
