/**
 * Amplify Gen 2 backend definition.
 *
 * Resources defined here:
 *
 *   markdownNegotiation (Amplify Function)
 *     Node.js Lambda visible in Amplify Console → Functions.
 *     Proxies all requests to the Amplify origin and rewrites
 *     Accept: text/markdown requests to .md file URIs.
 *
 *   MarkdownNegotiationStack (custom CDK stack)
 *     CloudFront distribution with the Lambda Function URL as its origin.
 *     Optionally attaches a custom domain when DOCS_DOMAIN + DOCS_CERT_ARN
 *     are both set.
 *
 * Environment variables (set per-branch in Amplify Console →
 * App Settings → Environment Variables):
 *
 *   AMPLIFY_DEFAULT_DOMAIN   Amplify origin the Lambda proxies to
 *                            e.g. main.d3fvsd1wbz3mbt.amplifyapp.com
 *                            Defaults to the staging origin when unset.
 *
 *   DOCS_DOMAIN              Custom domain for the CloudFront distribution
 *                            e.g. docs.cartesi.io
 *                            Defaults to staging.docs.cartesi.io when unset.
 *
 *   DOCS_CERT_ARN            ACM certificate ARN for DOCS_DOMAIN (us-east-1)
 *                            e.g. arn:aws:acm:us-east-1:123456789012:certificate/…
 *                            Leave unset for staging (no custom domain attached).
 */

import { defineBackend } from '@aws-amplify/backend';
import { CfnOutput, Fn } from 'aws-cdk-lib';
import * as lambdaCdk from 'aws-cdk-lib/aws-lambda';
import { markdownNegotiation } from './functions/markdown-negotiation/resource';
import { MarkdownNegotiation } from './custom/markdown-negotiation/resource';

// ---------------------------------------------------------------------------
// Backend — registers the Amplify-managed Lambda
// ---------------------------------------------------------------------------

const backend = defineBackend({ markdownNegotiation });

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const docsCertArn = process.env.DOCS_CERT_ARN ?? undefined;
const docsDomain  = process.env.DOCS_DOMAIN   ?? 'staging.docs.cartesi.io';

// ---------------------------------------------------------------------------
// Lambda Function URL
// ---------------------------------------------------------------------------

// Attach a public Function URL to the Amplify-managed Lambda so CloudFront
// can use it as an HTTP origin. Auth mode NONE — CloudFront is the access layer.
const lambdaFn = backend.markdownNegotiation.resources.lambda;
const fnUrl = lambdaFn.addFunctionUrl({
  authType: lambdaCdk.FunctionUrlAuthType.NONE,
});

// Extract just the hostname from the Function URL for use in HttpOrigin.
// Lambda URL format: https://<id>.lambda-url.<region>.on.aws/
const lambdaUrlHostname = Fn.select(2, Fn.split('/', fnUrl.url));

// Emit the raw URL as a CloudFormation output for direct testing before DNS cutover.
new CfnOutput(lambdaFn.stack, 'NegotiationLambdaUrl', {
  value: fnUrl.url,
  description: 'Lambda Function URL — call directly to test without CloudFront',
});

// ---------------------------------------------------------------------------
// CloudFront distribution (custom stack)
// ---------------------------------------------------------------------------

// Note: backend.createStack does not accept StackProps — the distribution
// deploys in whatever region the Amplify app is configured to use. CloudFront
// distributions can be defined in any region; the only constraint is that
// DOCS_CERT_ARN must reference a certificate in us-east-1.
const markdownStack = backend.createStack('MarkdownNegotiationStack');

const negotiation = new MarkdownNegotiation(markdownStack, 'MarkdownNegotiation', {
  lambdaUrlHostname,
  certificateArn: docsCertArn,
  alternateDomain: docsDomain,
});

// ---------------------------------------------------------------------------
// Outputs
// ---------------------------------------------------------------------------

backend.addOutput({
  custom: {
    markdownNegotiationDistributionDomain:
      negotiation.distribution.distributionDomainName,
  },
});
