import type { Counter } from 'prom-client';
import { getAddress } from 'viem';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

import {
  METRIC_CONTRACT_ADDRESSES,
  getMetricContractAbi,
  MetricContractName,
} from './contract-addresses-metrics';
import { getFunctionNameFromAbi } from './get-function-name-from-abi';

const UNKNOWN_LABEL = 'unknown';
const ADDRESS_LENGTH = 42; // '0x' + 40 hex chars
const LOG_ERROR_MAX_LENGTH = 200;

// Parser errors can quote their whole input, so keep log lines bounded.
const shortError = (error: unknown) => {
  const text =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return text.length > LOG_ERROR_MAX_LENGTH
    ? `${text.slice(0, LOG_ERROR_MAX_LENGTH)}…`
    : text;
};

// Matches a 4-byte function selector at the start of calldata.
const SELECTOR_PREFIX = /^0x[0-9a-fA-F]{8}/;

// Increments the eth_call Counter per batch entry. Every label is drawn from a
// finite, code-defined set so prom-client's in-memory label store (series are
// never evicted) stays bounded regardless of incoming traffic shape:
// - `address` / `contractName` are kept only for contracts in the
//   METRIC_CONTRACT_ADDRESSES allow-list;
// - `methodEncoded` / `methodDecoded` are kept only when the selector resolves
//   to a function in that contract's ABI. A raw 4-byte selector alone is
//   attacker-chosen (2^32 values), so unresolved selectors collapse to
//   `unknown` even for allow-listed contracts.
//
// Per-call try/catch isolates each entry: a malformed call cannot drop
// metrics for siblings in the same batch.
export const collectRequestAddressMetric = async ({
  calls,
  chainId,
  metrics,
}: {
  calls: any[];
  chainId: CHAINS;
  metrics: Counter<string>;
}) => {
  calls.forEach((call: any) => {
    try {
      if (
        !call ||
        typeof call !== 'object' ||
        call.method !== 'eth_call' ||
        !call.params?.[0]?.to
      ) {
        return;
      }

      const { to, data } = call.params[0];
      // Metrics collection is independent of the route's own checks, so verify
      // the shape here rather than assuming a well-formed address.
      if (typeof to !== 'string' || to.length !== ADDRESS_LENGTH) return;
      const address = getAddress(to);
      const contractName = METRIC_CONTRACT_ADDRESSES?.[chainId]?.[address];

      let methodEncoded: string = UNKNOWN_LABEL;
      let methodDecoded: string = UNKNOWN_LABEL;
      // `data` is untrusted JSON: anything but a hex string (e.g. an array,
      // whose .slice/.length mimic a string) must not reach a label value.
      if (
        contractName &&
        typeof data === 'string' &&
        SELECTOR_PREFIX.test(data)
      ) {
        const abi = getMetricContractAbi(contractName as MetricContractName);
        if (!abi) {
          console.warn(`ABI not found for contract: ${contractName}`);
        } else {
          const selector = data.slice(0, 10).toLowerCase();
          const functionName = getFunctionNameFromAbi(abi, selector);
          if (functionName) {
            methodEncoded = selector;
            methodDecoded = functionName;
          }
        }
      }

      metrics
        .labels({
          address: contractName ? address : UNKNOWN_LABEL,
          contractName: contractName || UNKNOWN_LABEL,
          methodEncoded,
          methodDecoded,
        })
        .inc(1);
    } catch (error) {
      console.warn(
        `[collectRequestAddressMetric] skipping malformed call: ${shortError(
          error,
        )}`,
      );
    }
  });
};
