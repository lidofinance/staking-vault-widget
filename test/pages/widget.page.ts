import { expect, Locator, Page } from '@playwright/test';
import { appPaths } from 'consts/routing';

export class WidgetPage {
  readonly page: Page;
  readonly title: Locator;
  readonly stakeFormButton: Locator;
  readonly lidoStatistic: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = this.page.locator('h1', { hasText: 'Stake Ether' });
    this.stakeFormButton = this.page.locator('main button', {
      hasText: /^(Connect wallet|Unsupported chain)$/,
    });
    this.lidoStatistic = this.page.locator('section', {
      hasText: 'Lido statistic',
    });
  }

  async goto() {
    await this.page.goto(appPaths.vaults.all);
    await expect(this.title).toBeVisible();
  }
}
