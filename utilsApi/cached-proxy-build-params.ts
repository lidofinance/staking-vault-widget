import type { NextApiRequest } from 'next';

// Builds a deterministic URLSearchParams from `req.query`, respecting:
//   - ignoreParams: collapse to null (cache-key uses only the proxy URL)
//   - allowedQueryParams: whitelist — unknown keys are dropped so an
//     attacker cannot mint unbounded cache-key variants
export const buildParams = (
  query: NextApiRequest['query'],
  ignoreParams: boolean | undefined,
  allowedQueryParams: string[] | undefined,
): URLSearchParams | null => {
  if (ignoreParams) return null;
  const keys = Object.keys(query);
  if (keys.length === 0) return null;

  const filtered = (
    allowedQueryParams
      ? keys.filter((k) => allowedQueryParams.includes(k))
      : keys
  ).reduce(
    (acc, k) => {
      const v = query[k];
      if (typeof v === 'string') acc[k] = v;
      return acc;
    },
    {} as Record<string, string>,
  );

  if (Object.keys(filtered).length === 0) return null;
  return new URLSearchParams(filtered);
};
