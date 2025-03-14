export const validateFormValue = <T>(value: T): boolean => {
  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return true;
  } else if (typeof value === 'string') {
    return value !== '' || value.length > 0;
  } else if (typeof value === 'undefined') {
    return false;
  }

  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  return !(
    (Array.isArray(value) && value.length === 0) ||
    ((value instanceof Set || value instanceof Map) && value.size === 0) ||
    (value && typeof value === 'object' && Object.keys(value).length === 0)
  );
};
