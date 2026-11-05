import { describe, test, expect } from '@jest/globals';

import { EventSubsciption } from '../event-subsciption';

describe('EventSubsciption.fire', () => {
  test('resolves only after async subscribers finish', async () => {
    const event = new EventSubsciption();
    let finished = false;
    let release: () => void = () => {};
    event.subscribe(
      () =>
        new Promise<void>((resolve) => {
          release = () => {
            finished = true;
            resolve();
          };
        }),
    );

    const fired = event.fire();
    let settled = false;
    void fired.then(() => {
      settled = true;
    });
    await Promise.resolve();
    // the retry attempt is still running, so Retry must stay locked
    expect(settled).toBe(false);

    release();
    await fired;
    expect(finished).toBe(true);
  });

  test('sync subscribers resolve right away', async () => {
    const event = new EventSubsciption();
    const calls: string[] = [];
    event.subscribe(() => {
      calls.push('a');
    });
    await event.fire();
    expect(calls).toEqual(['a']);
  });

  test('unsubscribed handlers are not called', async () => {
    const event = new EventSubsciption();
    const calls: string[] = [];
    const unsubscribe = event.subscribe(() => {
      calls.push('a');
    });
    unsubscribe();
    await event.fire();
    expect(calls).toEqual([]);
  });
});
