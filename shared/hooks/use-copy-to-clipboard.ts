import { useCallback } from 'react';
import { ToastInfo } from '@lidofinance/lido-ui';

export const useCopyToClipboard = (text: string): (() => void) => {
  return useCallback(
    async (message = 'Copied to clipboard') => {
      if ('navigator' in globalThis) {
        await navigator.clipboard.writeText(text);
        ToastInfo(message, {});
      }
    },
    [text],
  );
};
