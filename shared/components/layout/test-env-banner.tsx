import { TestEnvBanner as LidoTestEnvBanner } from '@lidofinance/lido-app-ui';
import { overrideWithQAMockBoolean } from 'utils/qa';
import { config } from 'config';
import NoSsrWrapper from '../no-ssr-wrapper';

// `isProd === false` (not `!isProd`): on production a stale cached
// runtime `window-env.js` may predate the `isProd` variable, making it
// `undefined` there. Requiring an explicit `false` keeps the banner
// hidden in that case instead of wrongly showing it on production.
const showTestEnvBanner = overrideWithQAMockBoolean(
  config.isProd === false,
  'mock-qa-helpers-show-test-env-banner',
);

export const TestEnvBanner = () => {
  if (!showTestEnvBanner) return null;
  return (
    <NoSsrWrapper>
      <LidoTestEnvBanner />
    </NoSsrWrapper>
  );
};
