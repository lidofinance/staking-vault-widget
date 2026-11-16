import { describe, test, expect } from '@jest/globals';
import type { ServerResponse } from 'node:http';

import { buildCspDirectives } from '../directives.js';
import {
  cspInputsFromEnv,
  createCspHeader,
  setCspHeaderOnHtml,
} from '../csp-header.js';

const CSP: [string, string] = ['Content-Security-Policy', "default-src 'self'"];

// The slice of ServerResponse the hook touches
class FakeResponse {
  headers = new Map<string, string>();
  writeHeadCalls: unknown[][] = [];

  getHeader(name: string) {
    return this.headers.get(name.toLowerCase());
  }
  setHeader(name: string, value: string) {
    this.headers.set(name.toLowerCase(), value);
    return this;
  }
  writeHead(...args: unknown[]) {
    this.writeHeadCalls.push(args);
    return this;
  }
}

const setup = (contentType?: string) => {
  const res = new FakeResponse();
  if (contentType) res.setHeader('Content-Type', contentType);
  setCspHeaderOnHtml(res as unknown as ServerResponse, CSP);
  return res;
};

describe('cspInputsFromEnv', () => {
  test('splits and trims trusted hosts', () => {
    expect(
      cspInputsFromEnv({
        CSP_TRUSTED_HOSTS: 'https://matomo.testnet.fi, https://*.testnet.fi,',
      }).trustedHosts,
    ).toEqual(['https://matomo.testnet.fi', 'https://*.testnet.fi']);
  });

  test('empty env gives no hosts, no report uri, enforced policy', () => {
    expect(cspInputsFromEnv({ CSP_REPORT_URI: '' })).toEqual({
      trustedHosts: [],
      reportUri: undefined,
      reportOnly: false,
    });
  });

  test('reads report uri and report-only flag', () => {
    expect(
      cspInputsFromEnv({
        CSP_REPORT_URI: 'https://stvaults-hoodi.testnet.fi/api/csp-report',
        CSP_REPORT_ONLY: 'true',
      }),
    ).toMatchObject({
      reportUri: 'https://stvaults-hoodi.testnet.fi/api/csp-report',
      reportOnly: true,
    });
  });
});

describe('createCspHeader', () => {
  test('puts runtime trusted hosts and report uri into the header', () => {
    const [name, value] = createCspHeader(
      buildCspDirectives(
        cspInputsFromEnv({
          CSP_TRUSTED_HOSTS: 'https://matomo.testnet.fi',
          CSP_REPORT_URI: 'https://stvaults-hoodi.testnet.fi/api/csp-report',
        }),
      ),
    );

    expect(name.toLowerCase()).toBe('content-security-policy');
    expect(value).toMatch(/script-src [^;]*https:\/\/matomo\.testnet\.fi/);
    expect(value).toContain(
      'report-uri https://stvaults-hoodi.testnet.fi/api/csp-report',
    );
  });

  test('report-only policy gives the report-only header', () => {
    const [name] = createCspHeader(
      buildCspDirectives(cspInputsFromEnv({ CSP_REPORT_ONLY: 'true' })),
    );
    expect(name.toLowerCase()).toBe('content-security-policy-report-only');
  });
});

describe('setCspHeaderOnHtml', () => {
  test('sets the header on an HTML response', () => {
    const res = setup('text/html; charset=utf-8');
    res.writeHead(200);
    expect(res.getHeader('content-security-policy')).toBe(CSP[1]);
    expect(res.writeHeadCalls).toEqual([[200]]);
  });

  test('reads content type passed to writeHead', () => {
    const res = setup();
    res.writeHead(200, { 'Content-Type': 'text/html' });
    expect(res.getHeader('content-security-policy')).toBe(CSP[1]);
  });

  test('sets the header on a 304', () => {
    const res = setup();
    res.writeHead(304);
    expect(res.getHeader('content-security-policy')).toBe(CSP[1]);
  });

  test('skips non-HTML responses', () => {
    const res = setup('application/json');
    res.writeHead(200);
    expect(res.getHeader('content-security-policy')).toBeUndefined();
  });
});
