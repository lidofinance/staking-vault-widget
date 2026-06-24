import type { API } from '@lidofinance/next-api-wrapper';

// Nests user-controlled payload under `violation` (never spread) so an
// attacker cannot shadow the `type` discriminator that downstream log
// shipping routes on. Malformed string bodies are logged as
// `{ parseError: true, bodyLen }` and answered with 200 — a 500 here would
// poison CSP telemetry.
export const cspReportHandler: API = async (req, res) => {
  let violation: unknown = {};

  if (typeof req.body === 'object' && req.body !== null) {
    violation = req.body;
  } else if (typeof req.body === 'string') {
    try {
      violation = JSON.parse(req.body);
    } catch {
      violation = { parseError: true, bodyLen: req.body.length };
    }
  }

  console.warn({ type: 'CSP Violation', violation });

  res.status(200).send({ status: 'ok' });
};
