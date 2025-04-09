import { expect, test } from '@playwright/test';
import { fail } from 'assert';
import { Validator } from 'jsonschema';
import { POST_REQUESTS, PostRequest } from './consts.js';

const validator = new Validator();

test.describe('Smoke POST', () => {
  POST_REQUESTS.forEach((element: PostRequest) => {
    test(element.uri, async ({ request }) => {
      const resp = await request.post(element.uri, { data: element.body });
      expect(resp.status()).toBe(200);
      const validationResult = validator.validate(
        await resp.json(),
        element.schema,
      );
      if (validationResult.errors.length > 0) {
        fail(validationResult.errors.join('\n'));
      }
    });
  });
});
