import { createSecureHeaders } from 'next-secure-headers';
import { buildCspDirectives, STATIC_SECURITY_HEADERS } from './directives.js';
import { updateGeneratedHeaders } from './update-generated-headers.js';

// All non-CSP security headers are managed via STATIC_SECURITY_HEADERS in directives.js
const CSP_ONLY_OPTIONS = {
  frameGuard: false,
  forceHTTPSRedirect: false,
  noopen: false,
  expectCT: false,
  nosniff: false,
  xssProtection: false,
  referrerPolicy: false,
};

/**
 * Builds all security headers for use in next.config.mjs headers().
 * CSP is excluded in IPFS mode (uses meta tag in _document.tsx) and development mode.
 *
 * @param {{ isIPFSMode?: boolean, isDevelopment?: boolean }} options
 * @returns {{ key: string, value: string }[]}
 */
export const buildSecurityHeaders = ({
  isIPFSMode = false,
  isDevelopment = false,
} = {}) => {
  const cspHeaders =
    isIPFSMode || isDevelopment
      ? []
      : updateGeneratedHeaders(
          createSecureHeaders({
            contentSecurityPolicy: buildCspDirectives({
              trustedHosts: process.env.CSP_TRUSTED_HOSTS
                ? process.env.CSP_TRUSTED_HOSTS.split(',')
                    .map((h) => h.trim())
                    .filter(Boolean)
                : [],
              reportUri: process.env.CSP_REPORT_URI,
              reportOnly: process.env.CSP_REPORT_ONLY === 'true',
            }),
            ...CSP_ONLY_OPTIONS,
          })
        );
  return [...cspHeaders, ...STATIC_SECURITY_HEADERS];
};
