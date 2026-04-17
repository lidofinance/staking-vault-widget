export const formatExpiry = (expiryTimestamp: bigint) =>
  formatSecondsToHours(
    (Number(expiryTimestamp) * 1000 - new Date().getTime()) / 1000,
    true,
  );

const getTimePostfix = (
  isShort: boolean | undefined,
  timeFormat: 'minutes' | 'hours',
) => {
  if (!isShort) {
    return timeFormat;
  }

  return timeFormat === 'minutes' ? 'm' : 'h';
};

export const formatSecondsToHours = (
  totalSeconds: number | string,
  isShort?: boolean,
): string => {
  const seconds = Number(totalSeconds);
  if (isNaN(seconds)) return String(totalSeconds);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0 && minutes === 0) return '~1 minute';
  if (hours === 0) return `${minutes} ${getTimePostfix(isShort, 'minutes')}`;
  if (minutes === 0) return `${hours} ${getTimePostfix(isShort, 'hours')}`;
  return `${hours}h ${minutes}m`;
};

const customDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'shortOffset',
});

export const formatCustomDate = (ts: number): string => {
  const ms = Math.abs(ts) < 1e11 ? ts * 1000 : ts;
  return customDateFormatter.format(new Date(ms));
};

export const formatDate = (date: Date): string => {
  return customDateFormatter.format(date);
};
