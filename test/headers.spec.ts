import { expect, test } from '@playwright/test';
import { getAllPagesRoutes } from './utils/collect-next-pages.js';

import { CACHE_CONTROL_PAGES } from 'next.config.mjs';
import { CONFIG } from './config.js';

// case for only wildcard in config
const configPages = CACHE_CONTROL_PAGES;
configPages[CACHE_CONTROL_PAGES.indexOf('/favicon:size*')] = '/favicon.ico';

test.describe('Page Headers', () => {
  test('Config should have all static pages', () => {
    test.skip(!!CONFIG.STAND_TYPE, 'We cannot access files on stands');
    const pageRoutes = getAllPagesRoutes();
    pageRoutes.forEach((foundPage) =>
      expect(CACHE_CONTROL_PAGES.includes(foundPage)).toBe(true),
    );
  });
});
