import { health } from '@lidofinance/next-pages';

// GET-only health check — health probes never carry a body, so skip
// bodyParser entirely to avoid allocating up to 1MB per request.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default health;
