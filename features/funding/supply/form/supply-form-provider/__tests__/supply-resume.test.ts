import { describe, test, expect } from '@jest/globals';

import {
  getMintFunding,
  getSupplyResumeKey,
  getSupplyResumeState,
  shouldTurnOffMint,
} from '../supply-resume';

const VAULT = '0x00000000000000000000000000000000000000aa';
const RECIPIENT = '0xAbCdEf0000000000000000000000000000000001';

const base = { amount: 8n, mintSteth: true, token: 'ETH' };

describe('getSupplyResumeKey', () => {
  test('raw form values match the validated values the sender used', () => {
    // the address schema trims and lowercases the recipient
    expect(
      getSupplyResumeKey(VAULT, { ...base, mintAddress: ` ${RECIPIENT} ` }),
    ).toBe(
      getSupplyResumeKey(VAULT, {
        ...base,
        mintAddress: RECIPIENT.toLowerCase(),
      }),
    );
  });

  test('the recipient does not matter when not minting', () => {
    const noMint = { ...base, mintSteth: false };
    expect(getSupplyResumeKey(VAULT, { ...noMint, mintAddress: '' })).toBe(
      getSupplyResumeKey(VAULT, { ...noMint, mintAddress: undefined }),
    );
  });

  test('another amount, token, recipient or vault is another operation', () => {
    const key = getSupplyResumeKey(VAULT, { ...base, mintAddress: RECIPIENT });
    expect(
      getSupplyResumeKey(VAULT, {
        ...base,
        amount: 9n,
        mintAddress: RECIPIENT,
      }),
    ).not.toBe(key);
    expect(
      getSupplyResumeKey(VAULT, {
        ...base,
        token: 'wETH',
        mintAddress: RECIPIENT,
      }),
    ).not.toBe(key);
    expect(getSupplyResumeKey(VAULT, { ...base, mintAddress: VAULT })).not.toBe(
      key,
    );
    expect(
      getSupplyResumeKey(RECIPIENT, { ...base, mintAddress: RECIPIENT }),
    ).not.toBe(key);
  });
});

describe('supply resume state', () => {
  test('nothing confirmed: quote with the funding, check the selected token', () => {
    const steps = new Set<string>();
    expect(getSupplyResumeState(steps)).toEqual({
      isFunded: false,
      balanceCheck: 'token',
    });
    expect(getMintFunding(8n, steps)).toBe(8n);
  });

  test('fund confirmed, mint failed: quote without it, no balance is spent', () => {
    // the vault already holds the amount; counting it again overstates "You will receive"
    const steps = new Set(['fund']);
    expect(getSupplyResumeState(steps)).toEqual({
      isFunded: true,
      balanceCheck: 'none',
    });
    expect(getMintFunding(8n, steps)).toBe(0n);
  });

  test('wETH unwrapped, fund failed: the fund is checked against ETH, not the spent wETH', () => {
    // 8 wETH unwrapped: the wallet holds 0 wETH and the 8 ETH the fund is sent from
    const steps = new Set(['unwrap']);
    expect(getSupplyResumeState(steps)).toEqual({
      isFunded: false,
      balanceCheck: 'eth',
    });
    expect(getMintFunding(8n, steps)).toBe(8n);
  });
});

describe('shouldTurnOffMint', () => {
  test('turns the mint off when nothing can be minted', () => {
    expect(
      shouldTurnOffMint({
        mintSteth: true,
        isStethMintable: false,
        isFunded: false,
      }),
    ).toBe(true);
  });

  test('keeps it on a resume after a confirmed fund, so a Retry does not fund again', () => {
    // the mint failed because the capacity ran out: turning it off would change the
    // resume key, forget the fund and make Retry send it a second time
    expect(
      shouldTurnOffMint({
        mintSteth: true,
        isStethMintable: false,
        isFunded: true,
      }),
    ).toBe(false);
  });

  test('nothing to turn off', () => {
    expect(
      shouldTurnOffMint({
        mintSteth: false,
        isStethMintable: false,
        isFunded: false,
      }),
    ).toBe(false);
    expect(
      shouldTurnOffMint({
        mintSteth: true,
        isStethMintable: true,
        isFunded: false,
      }),
    ).toBe(false);
  });
});
