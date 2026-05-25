import { defineFunction } from '@aws-amplify/backend';

/**
 * Amplify-managed Lambda function for Accept: text/markdown content negotiation.
 *
 * Appears in Amplify Console → Functions as "docs-markdown-negotiation".
 * Logs: CloudWatch → /aws/lambda/<amplify-generated-name>
 *
 * AMPLIFY_ORIGIN is set from AMPLIFY_DEFAULT_DOMAIN (set per-branch in
 * Amplify Console → App Settings → Environment Variables).
 * Defaults to the staging Amplify origin when the env var is not set.
 */
export const markdownNegotiation = defineFunction({
  name: 'docs-markdown-negotiation',
  entry: './handler.mjs',
  environment: {
    AMPLIFY_ORIGIN:
      process.env.AMPLIFY_DEFAULT_DOMAIN ?? 'staging.d3fvsd1wbz3mbt.amplifyapp.com',
  },
  timeoutSeconds: 30,
  memoryMB: 256,
  runtime: 20,
});
