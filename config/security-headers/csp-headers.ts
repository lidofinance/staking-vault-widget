import type { ContentSecurityPolicyOption } from 'next-secure-headers/lib/rules';

// Don't use absolute import here!
// code'''
//    import { config, secretConfig } from 'config';
// '''
// otherwise you will get something like a cyclic error!
import { config } from '../get-config';
import { secretConfig } from '../get-secret-config';
import { IPFS_BASE_SCRIPT_HASH } from 'features/ipfs';
import { buildCspDirectives } from './directives.js';

const trustedHosts = secretConfig.cspTrustedHosts
  ? secretConfig.cspTrustedHosts.split(',')
  : [];

export const contentSecurityPolicy = buildCspDirectives({
  trustedHosts,
  reportUri: secretConfig.cspReportUri,
  reportOnly: secretConfig.cspReportOnly,
  ipfsMode: config.ipfsMode,
  ipfsScriptHash: IPFS_BASE_SCRIPT_HASH,
  developmentMode: config.developmentMode,
}) as ContentSecurityPolicyOption;
