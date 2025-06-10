import { z } from 'zod';

import { addressSchema } from 'utils/validate-form-value';
import { zodResolver } from '@hookform/resolvers/zod';

export const claimFormSchema = z.object({
  recipient: addressSchema,
});

export const claimFormResolver = zodResolver(
  claimFormSchema,
  { async: false },
  { mode: 'sync' },
);
