import { useCallback } from 'react';
import { ToastInfo } from '@lidofinance/lido-ui';

export const useCopyToClipboard = (text: string): (() => void) => {
  return useCallback(() => {
    void navigator.clipboard.writeText(text).then(() => {
      ToastInfo('Copied to clipboard', {});
    });
  }, [text]);
};
