const toHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

const valueToString = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  const type = typeof value;

  if (type === 'string' || type === 'number' || type === 'boolean') {
    return String(value);
  } else if (type === 'bigint') {
    return `${value}n`;
  } else if (type === 'symbol') {
    return value.toString();
  } else if (type === 'function') {
    return `function:${value.name || 'anonymous'}`;
  } else if (Array.isArray(value)) {
    return `array:${value.map(valueToString).join(',')}`;
  } else if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  } else if (value instanceof RegExp) {
    return `regex:${value.toString()}`;
  } else if (value instanceof Map) {
    const entries = Array.from(value.entries())
      .map(([k, v]) => `${valueToString(k)}:${valueToString(v)}`)
      .sort()
      .join('|');
    return `map:${entries}`;
  } else if (value instanceof Set) {
    const entries = Array.from(value.values())
      .map(valueToString)
      .sort()
      .join(',');
    return `set:${entries}`;
  } else if (type === 'object') {
    const nestedPrimitives: Record<string, string> = {};
    Object.keys(value).forEach((key) => {
      nestedPrimitives[key] = valueToString(value[key]);
    });

    const sortedKeys = Object.keys(nestedPrimitives).sort();
    return (
      'object:' +
      sortedKeys.map((key) => `${key}=${nestedPrimitives[key]}`).join('|')
    );
  }

  return 'unknown';
};

export const getHashFromObject = <T extends Record<string, any>>(
  obj: T | undefined | null,
): string => {
  if (obj === undefined || obj === null) {
    return String(obj);
  }

  const primitives: Record<string, string> = {};

  Object.keys(obj).forEach((key) => {
    primitives[key] = valueToString(obj[key]);
  });

  const sortedKeys = Object.keys(primitives).sort();
  const hashString = sortedKeys
    .map((key) => `${key}=${primitives[key]}`)
    .join('|');

  return toHash(hashString);
};
