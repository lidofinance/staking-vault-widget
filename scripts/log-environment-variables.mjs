/* eslint-disable no-console */
export const openKeys = [
  'SELF_ORIGIN',
  'ROOT_ORIGIN',
  'DOCS_ORIGIN',
  'HELP_ORIGIN',
  'RESEARCH_ORIGIN',
  'BLOG_ORIGIN',

  'SUPPORTED_CHAINS',
  'DEFAULT_CHAIN',

  'CSP_TRUSTED_HOSTS',
  'CSP_REPORT_ONLY',
  'CSP_REPORT_URI',

  'ENABLE_QA_HELPERS',

  'RATE_LIMIT',
  'RATE_LIMIT_TIME_FRAME',

  'MATOMO_URL',
  'WALLETCONNECT_PROJECT_ID',
  'VALIDATION_FILE_PATH',
];

export const secretKeys = [
  `1`,
  ...(process.env.SUPPORTED_CHAINS?.split(',') ?? []),
]
  .filter((chain, index, arr) => arr.indexOf(chain) == index)
  .map((chain) => `EL_RPC_URLS_${chain}`);

export const logOpenEnvironmentVariables = () => {
  console.log('---------------------------------------------');
  console.log('Log environment variables (without secrets):');
  console.log('---------------------------------------------');

  for (const key of openKeys) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      console.error(`${key} - ERROR (not exist in process.env)`);
      continue;
    }

    console.info(`${key} = ${process.env[key]}`);
  }

  console.log('---------------------------------------------');
  console.log('');
};

export const logSecretEnvironmentVariables = () => {
  console.log('---------------------------------------------');
  console.log('Log secret environment variables:');
  console.log('---------------------------------------------');

  // console.log('process.env:', process.env)
  for (const key of secretKeys) {
    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      console.error(`Secret ${key} - ERROR (not exist in process.env)`);
      continue;
    }

    if (process.env[key].length > 0) {
      console.info(`Secret ${key} - OK (exist and not empty)`);
    } else {
      console.warn(`Secret ${key} - WARN (exist but empty)`);
    }
  }

  console.log('---------------------------------------------');
};

export const logEnvironmentVariables = () => {
  logOpenEnvironmentVariables();
  logSecretEnvironmentVariables();
};
