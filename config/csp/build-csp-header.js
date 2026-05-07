import { createSecureHeaders } from 'next-secure-headers';
import { buildCspDirectives } from './csp-directives.js';

const SECURE_HEADERS_OPTIONS = {
  // All other security headers are applied directly in next.config.mjs for better control
  frameGuard: false,
  forceHTTPSRedirect: false,
  noopen: false,
  expectCT: false,
  nosniff: false,
  // there is no way to avoid setting it, so align with next.config.mjs value
  xssProtection: 'block-rendering',
  referrerPolicy: false,
};

/**
 * Builds CSP header(s) for use in next.config.mjs headers().
 * IPFS mode and development mode are excluded — IPFS uses a meta tag in _document.tsx.
 *
 * @param {{ isIPFSMode?: boolean, isDevelopment?: boolean }} options
 * @returns {{ key: string, value: string }[]}
 */
export const buildCspHeaders = ({
  isIPFSMode = false,
  isDevelopment = false,
} = {}) => {
  if (isIPFSMode || isDevelopment) return [];

  const trustedHosts = process.env.CSP_TRUSTED_HOSTS
    ? process.env.CSP_TRUSTED_HOSTS.split(',')
        .map((h) => h.trim())
        .filter(Boolean)
    : [];

  return createSecureHeaders({
    contentSecurityPolicy: buildCspDirectives({
      trustedHosts,
      reportUri: process.env.CSP_REPORT_URI,
      reportOnly: process.env.CSP_REPORT_ONLY === 'true',
    }),
    ...SECURE_HEADERS_OPTIONS,
  });
};
