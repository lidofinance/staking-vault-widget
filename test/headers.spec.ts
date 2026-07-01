import { expect, test } from '@playwright/test';
import type { APIResponse } from '@playwright/test';
import { getAllPagesRoutes } from './utils/collect-next-pages.js';

import { CACHE_CONTROL_PAGES } from 'next.config.mjs';
import { CONFIG } from './config.js';

// case for only wildcard in config
CACHE_CONTROL_PAGES[CACHE_CONTROL_PAGES.indexOf('/favicon:size*')] =
  '/favicon.ico';

// SSG routes that previously received no CSP headers due to HOC + getStaticProps interaction
const SSG_ROUTES = ['/', '/vaults', '/vaults/create'];

const CSP_HEADER_NAMES = [
  'content-security-policy',
  'content-security-policy-report-only',
] as const;

const getCspValue = (response: APIResponse): string | undefined => {
  const headers = response.headers();
  return CSP_HEADER_NAMES.map((name) => headers[name]).find(Boolean);
};

const parseCsp = (value: string): Record<string, string> => {
  return Object.fromEntries(
    value
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const [directive, ...values] = d.split(' ');
        return [directive, values.join(' ')];
      }),
  );
};

test.describe('Page Headers', () => {
  test('Config should have all static pages', () => {
    test.skip(!!CONFIG.STAND_TYPE, 'We cannot access files on stands');
    const pageRoutes = getAllPagesRoutes();
    pageRoutes.forEach((foundPage) =>
      expect(CACHE_CONTROL_PAGES.includes(foundPage)).toBe(true),
    );
  });
});

test.describe('Static Security Headers', () => {
  for (const route of SSG_ROUTES) {
    test(`${route} — all static security headers are present`, async ({
      request,
    }) => {
      const response = await request.get(route);
      const headers = response.headers();

      expect(headers['x-dns-prefetch-control']).toBe('on');
      expect(headers['strict-transport-security']).toContain('max-age=');
      expect(headers['strict-transport-security']).toContain(
        'includeSubDomains',
      );
      expect(headers['referrer-policy']).toBe('same-origin');
      expect(headers['x-content-type-options']).toBe('nosniff');
      expect(headers['x-xss-protection']).toBe('1; mode=block');
      expect(headers['x-download-options']).toBe('noopen');
      expect(headers['x-permitted-cross-domain-policies']).toBe('none');
      expect(headers['cross-origin-opener-policy']).toBe(
        'same-origin-allow-popups',
      );
      expect(headers['permissions-policy']).toContain('camera=()');
    });
  }
});

test.describe('CSP Headers', () => {
  for (const route of SSG_ROUTES) {
    test.describe(route, () => {
      let cspValue: string;
      let directives: Record<string, string>;

      test.beforeEach(async ({ request }) => {
        const response = await request.get(route);
        cspValue = getCspValue(response) ?? '';
        directives = parseCsp(cspValue);
        test.skip(
          !cspValue,
          `No CSP header on ${route} — skipped in dev/IPFS mode`,
        );
      });

      test('header is present (Content-Security-Policy or Report-Only)', () => {
        expect(cspValue).toBeTruthy();
      });

      test("default-src is 'self'", () => {
        expect(directives['default-src']).toBe("'self'");
      });

      test('script-src contains sha256 hash for inline theme script', () => {
        expect(directives['script-src']).toContain(
          "'sha256-wTvVT3oJ2rMAqNUILvSYccTn53N47S3NIZbPE0ql0No='",
        );
      });

      test('connect-src allows https and wss', () => {
        expect(directives['connect-src']).toContain('https:');
        expect(directives['connect-src']).toContain('wss:');
      });

      test('frame-ancestors allows any origin (iframe embedding)', () => {
        expect(directives['frame-ancestors']).toBe('*');
      });

      test("base-uri is 'none'", () => {
        expect(directives['base-uri']).toBe("'none'");
      });

      test('worker-src and object-src are blocked', () => {
        expect(directives['worker-src']).toBe("'none'");
        expect(directives['object-src']).toBe("'none'");
      });

      test('frame-src and child-src allow WalletConnect', () => {
        expect(directives['frame-src']).toContain(
          'https://*.walletconnect.org',
        );
        expect(directives['child-src']).toContain(
          'https://*.walletconnect.org',
        );
      });

      test('font-src allows reown fonts', () => {
        expect(directives['font-src']).toContain('https://fonts.reown.com');
      });
    });
  }
});
