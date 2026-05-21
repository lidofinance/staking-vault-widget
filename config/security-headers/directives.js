const SCRIPT_SHA256 =
  "'sha256-wTvVT3oJ2rMAqNUILvSYccTn53N47S3NIZbPE0ql0No='";

const WALLETCONNECT_HOSTS = [
  'https://*.walletconnect.org',
  'https://*.walletconnect.com',
];

/**
 * Builds a ContentSecurityPolicyOption-compatible directives object.
 * Used by both next.config.mjs (via build-security-headers.js) and _document.tsx (via csp-headers.ts).
 *
 * @param {{
 *   trustedHosts?: string[],
 *   reportUri?: string,
 *   reportOnly?: boolean,
 *   ipfsMode?: boolean,
 *   ipfsScriptHash?: string,
 *   developmentMode?: boolean,
 * }} params
 */
export const buildCspDirectives = ({
  trustedHosts = [],
  reportUri,
  reportOnly = false,
  ipfsMode = false,
  ipfsScriptHash,
  developmentMode = false,
} = {}) => ({
  directives: {
    'default-src': ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:', 'https://fonts.reown.com'],
    imgSrc: ["'self'", 'data:', 'blob:', ...WALLETCONNECT_HOSTS],
    scriptSrc: [
      "'self'",
      // light/dark theme on pageload apply script
      // if script changes, new hash must be checked against CSP error and updated
      SCRIPT_SHA256,
      ...(developmentMode ? ["'unsafe-eval'"] : []), // for HMR
      ...(ipfsMode && ipfsScriptHash ? [ipfsScriptHash] : []),
      ...trustedHosts,
    ],
    connectSrc: [
      "'self'",
      'https:',
      'wss:',
      ...(developmentMode ? ['ws:'] : []), // for HMR
    ],
    // These directives are ignored when delivered via a <meta> element (IPFS mode).
    ...(!ipfsMode && {
      // Widget can be integrated into many wallets as iframe e.g Ledger Live, Safe Wallet
      frameAncestors: ['*'],
      // Legacy reporting — modern report-to requires Reporting-Endpoints header
      reportURI: reportUri,
    }),
    // frame-src takes precedence over child-src for iframes in modern browsers
    frameSrc: ["'self'", ...WALLETCONNECT_HOSTS],
    // child-src kept as fallback for older browsers
    childSrc: ["'self'", ...WALLETCONNECT_HOSTS],
    workerSrc: ["'none'"],
    objectSrc: ["'none'"], // Block plugins (Flash etc.)
    mediaSrc: ["'none'"], // No audio/video sources needed
    manifestSrc: ["'self'"],
    formAction: ["'self'"], // Prevent form hijacking via XSS
    // Block inline event handlers (onclick="...", onerror="..." etc.)
    'script-src-attr': ["'none'"],
    'base-uri': ipfsMode ? undefined : ["'none'"],
  },
  reportOnly,
});

export const STATIC_SECURITY_HEADERS = [
  { key: 'x-dns-prefetch-control', value: 'on' },
  {
    key: 'strict-transport-security',
    value: 'max-age=2592000; includeSubDomains; preload',
  },
  { key: 'referrer-policy', value: 'same-origin' },
  { key: 'x-content-type-options', value: 'nosniff' },
  { key: 'x-xss-protection', value: '1; mode=block' },
  { key: 'x-download-options', value: 'noopen' },
  { key: 'x-permitted-cross-domain-policies', value: 'none' },
  { key: 'cross-origin-opener-policy', value: 'same-origin-allow-popups' },
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'display-capture=()',
      'encrypted-media=()',
      'serial=()',
      'xr-spatial-tracking=()',
      'browsing-topics=()',
      // Allow for the page itself; hardware wallets (Ledger/Trezor) may need these
      'usb=(self)',
      'bluetooth=(self)',
      'hid=(self)',
      'autoplay=(self)',
      'fullscreen=(self)',
      'picture-in-picture=(self)',
    ].join(', '),
  },
];
