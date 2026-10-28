import { createHeadersObject } from 'next-secure-headers';

const CSP_HEADER_NAMES = [
  'content-security-policy',
  'content-security-policy-report-only',
];

/**
 * @param {Record<string, string | undefined>} env
 */
export const cspInputsFromEnv = (env = process.env) => ({
  trustedHosts: env.CSP_TRUSTED_HOSTS
    ? env.CSP_TRUSTED_HOSTS.split(',')
        .map((h) => h.trim())
        .filter(Boolean)
    : [],
  // next-secure-headers rejects '' as an invalid URL
  reportUri: env.CSP_REPORT_URI || undefined,
  reportOnly: env.CSP_REPORT_ONLY === 'true',
});

/**
 * @param {object} contentSecurityPolicy - see buildCspDirectives in directives.js
 * @returns {[string, string]}
 */
export const createCspHeader = (contentSecurityPolicy) => {
  const header = Object.entries(
    createHeadersObject({ contentSecurityPolicy }),
  ).find(([name]) => CSP_HEADER_NAMES.includes(name.toLowerCase()));
  if (!header) throw new Error('[csp] the policy produced no header');
  return header;
};

const isHtml = (contentType) =>
  typeof contentType === 'string' &&
  contentType.toLowerCase().startsWith('text/html');

// header from the object form of writeHead(status[, message][, headers])
const headerOf = (headers, name) => {
  if (!headers || typeof headers !== 'object' || Array.isArray(headers)) {
    return undefined;
  }
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name);
  return key === undefined ? undefined : headers[key];
};

/**
 * Sets CSP on HTML responses and on 304 (sent before Next sets Content-Type).
 *
 * @param {import('node:http').ServerResponse} res
 * @param {[string, string]} cspHeader
 */
export const setCspHeaderOnHtml = (res, [name, value]) => {
  const writeHead = res.writeHead.bind(res);
  res.writeHead = function (statusCode, ...rest) {
    const headers = rest.find((arg) => arg && typeof arg === 'object');
    const contentType =
      this.getHeader('content-type') ?? headerOf(headers, 'content-type');
    if (statusCode === 304 || isHtml(contentType)) {
      this.setHeader(name, value);
    }
    return writeHead(statusCode, ...rest);
  };
};
