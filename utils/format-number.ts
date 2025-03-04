import { config } from 'config';

export const formatPercent = new Intl.NumberFormat(config.LOCALE, {
  style: 'percent',
});

export const formatDollar = new Intl.NumberFormat(config.LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
