import { config } from 'config';

export const overrideWithQAMockBoolean = (value: boolean, key: string) => {
  if (config.enableQaHelpers && typeof window !== 'undefined') {
    const mock = localStorage.getItem(key);
    if (mock) {
      return mock === 'true';
    }
  }
  return value;
};
