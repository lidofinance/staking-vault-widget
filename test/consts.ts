import { CONFIG } from './config.js';

export interface GetRequest {
  uri: string;
  schema: object;
  isDeprecated?: boolean;
  skipTestnet?: boolean;
}

export interface PostRequest {
  uri: string;
  body: object;
  schema: object;
}

export const POST_REQUESTS: PostRequest[] = [
  {
    uri: `/api/rpc?chainId=${CONFIG.STAND_CONFIG.chainId}`,
    body: { method: 'eth_blockNumber', params: [], id: 154, jsonrpc: '2.0' },
    schema: {
      type: 'object',
      properties: {
        jsonrpc: { type: 'string' },
        id: { type: 'number' },
        result: { type: 'string' },
      },
      required: ['jsonrpc', 'id', 'result'],
      additionalProperties: false,
    },
  },
  {
    uri: `api/csp-report`,
    body: {
      'csp-report': {
        'blocked-uri': 'http://example.com/css/style.css',
        disposition: 'report',
        'document-uri': 'http://example.com/signup.html',
        'effective-directive': 'style-src-elem',
        'original-policy':
          "default-src 'none'; style-src cdn.example.com; report-to /_/csp-reports",
        referrer: '',
        'status-code': 200,
        'violated-directive': 'style-src-elem',
      },
    },
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          const: 'ok',
        },
      },
    },
  },
];
