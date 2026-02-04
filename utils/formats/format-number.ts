import { config } from 'config';

export const formatPercent = new Intl.NumberFormat(config.LOCALE, {
  style: 'percent',
  maximumFractionDigits: 2,
});

export const formatToPercentWithDivider = (
  value: number | undefined | null,
) => {
  if (value == null) {
    return '';
  }

  return formatPercent.format(value / 100);
};

export const formatDollar = new Intl.NumberFormat(config.LOCALE, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
