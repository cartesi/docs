/**
 * CDK Construct: MarkdownNegotiation
 *
 * Defines a CloudFront distribution that fronts the Amplify-managed origin
 * and performs Accept: text/markdown content negotiation via a Lambda function.
 *
 * The Lambda itself is managed by Amplify (defineFunction in
 * amplify/functions/markdown-negotiation/resource.ts) and visible in
 * Amplify Console → Functions. This construct only manages the CloudFront
 * distribution that uses the Lambda Function URL as its origin.
 *
 * Request flow (after DNS cutover):
 *
 *   browser / agent
 *       │
 *       ▼  (docs.cartesi.io)
 *   This CloudFront distribution
 *       │
 *       ▼
 *   Lambda Function URL  (docs-markdown-negotiation)
 *       │  • Accept: text/markdown → fetches .md file from Amplify, returns it
 *       │  • all other requests   → proxies to Amplify unchanged
 *       ▼
 *   Amplify default domain  (main.<id>.amplifyapp.com)
 *       │  Amplify-managed CloudFront → S3
 *       ▼
 *   Pre-built static files  (.md files written by serve-markdown.js postBuild)
 */

import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MarkdownNegotiationProps {
  /**
   * Hostname of the Lambda Function URL used as the CloudFront origin.
   * Format: <id>.lambda-url.<region>.on.aws  (no https://, no trailing slash)
   *
   * Extracted from the FunctionUrl construct in backend.ts using
   * Fn.select(2, Fn.split('/', fnUrl.url)).
   */
  readonly lambdaUrlHostname: string;

  /**
   * ARN of an ACM certificate that covers `alternateDomain`.
   * MUST be in us-east-1 — CloudFront only accepts certificates from that region.
   *
   * Optional — when omitted the distribution is reachable only via its
   * *.cloudfront.net URL. Must be provided together with `alternateDomain`.
   */
  readonly certificateArn?: string;

  /**
   * The public hostname served by this distribution.
   * Example: docs.cartesi.io
   *
   * Optional — when omitted the distribution uses its auto-assigned
   * *.cloudfront.net domain. Must be provided together with `certificateArn`.
   */
  readonly alternateDomain?: string;
}

// ---------------------------------------------------------------------------
// Construct
// ---------------------------------------------------------------------------

export class MarkdownNegotiation extends Construct {
  /**
   * The CloudFront distribution. Its `distributionDomainName` is the value
   * to use as the CNAME target when updating DNS records.
   */
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: MarkdownNegotiationProps) {
    super(scope, id);

    // ── 1. Cache Policy ──────────────────────────────────────────────────────
    //
    // The Accept header MUST be part of the cache key; without it, the first
    // response (HTML or Markdown) would be cached and served to all subsequent
    // requests for the same URI, breaking content negotiation entirely.
    //
    // All query strings are included so search / filter parameters are preserved.
    // Cookies are excluded — this is a static documentation site with no
    // session-specific content.
    const cachePolicy = new cloudfront.CachePolicy(this, 'DocsVaryOnAccept', {
      cachePolicyName: 'docs-vary-on-accept',
      comment: 'Docs cache: vary on Accept so HTML and Markdown variants cache separately',
      minTtl: Duration.seconds(0),
      defaultTtl: Duration.seconds(300),      // 5 min default for HTML pages
      maxTtl: Duration.seconds(31_536_000),   // 1 year max (assets use immutable headers)
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept'),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    });

    // ── 2. ACM Certificate (optional) ────────────────────────────────────────
    //
    // Only imported when certificateArn is provided. When absent (e.g. staging)
    // the distribution is created without a custom domain and is reachable via
    // its auto-assigned *.cloudfront.net URL.
    const certificate =
      props.certificateArn
        ? acm.Certificate.fromCertificateArn(this, 'DocsCertificate', props.certificateArn)
        : undefined;

    // ── 3. Lambda origin ─────────────────────────────────────────────────────
    //
    // CloudFront calls the Lambda Function URL over HTTPS. The Lambda sets the
    // Host header to AMPLIFY_ORIGIN when fetching from Amplify, so no special
    // originRequestPolicy is needed here.
    const origin = new HttpOrigin(props.lambdaUrlHostname, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
    });

    // ── 4. Distribution ──────────────────────────────────────────────────────
    //
    // Always created. Custom domain and certificate are only attached when both
    // alternateDomain and certificateArn are provided.
    this.distribution = new cloudfront.Distribution(this, 'Distribution', {
      ...(props.alternateDomain && certificate
        ? { domainNames: [props.alternateDomain], certificate }
        : {}),

      defaultBehavior: {
        origin,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy,
      },
    });

    // ── 5. Output ─────────────────────────────────────────────────────────────
    new CfnOutput(this, 'MarkdownNegotiationDomain', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain — use as DNS CNAME target after cutover',
    });
  }
}
