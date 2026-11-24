// direct import instead of the `config` barrel: the barrel reaches this file
// through provider -> external-config, so a barrel import here would be cyclic
import { config } from 'config/get-config';

// while the repo is not public, this will force to use build time config
export const IPFS_MANIFEST_URL = '';

export const FEEDBACK_SURVEY_URL = 'https://tally.so/r/3X9vYe';

export const STVAULTS_ABOUT_LINK = `${config.rootOrigin}/stvaults`;
export const STVAULTS_DOCS_LINK = `${config.docsOrigin}/run-on-lido/stvaults/`;
