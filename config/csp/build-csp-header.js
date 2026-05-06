const SCRIPT_SHA256 =
  "'sha256-wTvVT3oJ2rMAqNUILvSYccTn53N47S3NIZbPE0ql0No='";
const WALLETCONNECT_HOSTS =
  'https://*.walletconnect.org https://*.walletconnect.com';

/**
 * Builds CSP header(s) for use in next.config.mjs headers().
 * IPFS mode and development mode are excluded — IPFS uses a meta tag in _document.tsx.
 *
 * @param {{ isIPFSMode?: boolean, isDevelopment?: boolean }} options
 * @returns {{ key: string, value: string }[]}
 */
export const buildCspHeaders = ({ isIPFSMode = false, isDevelopment = false } = {}) => {
  if (isIPFSMode || isDevelopment) return [];

  const trustedHosts = process.env.CSP_TRUSTED_HOSTS
    ? process.env.CSP_TRUSTED_HOSTS.split(',')
        .map((h) => h.trim())
        .filter(Boolean)
    : [];

  const scriptSrc = ["'self'", SCRIPT_SHA256, ...trustedHosts].join(' ');
  const connectSrc = ["'self'", 'https:', 'wss:'].join(' ');

  const directives = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data: https://fonts.reown.com",
    `img-src 'self' data: blob: ${WALLETCONNECT_HOSTS}`,
    `script-src ${scriptSrc}`,
    `connect-src ${connectSrc}`,
    'frame-ancestors *',
    ...(process.env.CSP_REPORT_URI
      ? [`report-uri ${process.env.CSP_REPORT_URI}`]
      : []),
    `frame-src 'self' ${WALLETCONNECT_HOSTS}`,
    `child-src 'self' ${WALLETCONNECT_HOSTS}`,
    "worker-src 'none'",
    "object-src 'none'",
    "media-src 'none'",
    "manifest-src 'self'",
    "form-action 'self'",
    "script-src-attr 'none'",
    "base-uri 'none'",
  ];

  const reportOnly = process.env.CSP_REPORT_ONLY === 'true';

  return [
    {
      key: reportOnly
        ? 'Content-Security-Policy-Report-Only'
        : 'Content-Security-Policy',
      value: directives.join('; '),
    },
  ];
}
