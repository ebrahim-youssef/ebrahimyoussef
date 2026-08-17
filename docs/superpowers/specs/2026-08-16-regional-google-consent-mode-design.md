# Regional Google Analytics Consent Mode Design

## Objective

Collect normal Google Analytics 4 measurements immediately for visitors outside the European Economic Area, United Kingdom, and Switzerland. For visitors inside those regions, use Google Advanced Consent Mode: send cookieless measurements while analytics storage is denied, then enable full analytics storage only after the visitor accepts.

The implementation uses Google tag `G-ZSD8RW67L3`. Advertising storage, advertising user data, and advertising personalization remain denied for every visitor because the site needs product analytics, not advertising features.

## Regional scope

Consent is required when Cloudflare reports either:

- `request.cf.isEUCountry === "1"`; or
- country code `IS`, `LI`, `NO`, `GB`, or `CH`.

This covers the EU members, the three additional EEA members, the United Kingdom, and Switzerland. If Cloudflare does not provide geographic metadata, the endpoint must fail safely by requiring consent.

## Architecture

### Cloudflare region endpoint

Add a small Cloudflare Worker entry point and configure the existing static-assets deployment with an `ASSETS` binding. Only `/api/privacy-region` runs through the Worker; ordinary static assets continue through Cloudflare's free static-asset path.

`GET /api/privacy-region` returns only:

```json
{ "requiresConsent": true }
```

The response never exposes the visitor's country. It uses `Cache-Control: private, no-store` so a regional decision cannot be shared between visitors. Unsupported methods return `405 Method Not Allowed`. Other Worker requests fall through to the static-assets binding.

### Analytics bootstrap

The production-only analytics component requests `/api/privacy-region` before loading Google Analytics.

- Outside the consent region, initialize `analytics_storage` as granted and load the Google tag immediately.
- Inside the consent region, initialize `analytics_storage` as denied, keep all advertising consent fields denied, load the Google tag, and display the consent prompt when no saved choice exists.
- If a regional visitor previously accepted, initialize the denied default first, load the tag, and immediately update `analytics_storage` to granted.
- If a regional visitor previously declined, keep analytics storage denied and show only the Privacy settings control.

The denied default must be queued before the `config` command and before the external `gtag.js` script is appended. This preserves Advanced Consent Mode's cookieless behavior before acceptance.

### Consent updates

Accepting updates `analytics_storage` to granted and persists the choice in local storage. Declining updates all consent fields to denied, clears existing `_ga` cookies, and persists the choice. Advertising consent fields are never granted.

The consent copy must explain that limited cookieless measurement is active before acceptance and that accepting enables Analytics cookies. The banner and Privacy settings control are visible only to visitors for whom the region endpoint requires consent.

## Failure handling

If the region request fails, times out, returns malformed data, or cannot access Cloudflare metadata, treat the visitor as requiring consent. Initialize denied consent before loading the tag, then present the banner. This may reduce measurement but cannot accidentally enable full analytics in a protected region.

Local Astro development remains analytics-free. Cloudflare Worker tests inject geographic metadata rather than depending on local preview, where `request.cf` may be unavailable.

## Testing

Implementation follows test-driven development:

1. Unit-test the regional predicate for an EU country, `IS`, `LI`, `NO`, `GB`, `CH`, a non-protected country, and missing metadata.
2. Unit-test the Worker endpoint's JSON, no-store header, method handling, and static-asset fallback.
3. Update the production-build verifier to require the regional endpoint bootstrap and Consent Mode v2 fields. Remove the old assertion that Google can never load before consent, because Advanced Consent Mode intentionally loads it with denied storage.
4. Verify the UI paths for first visit, saved acceptance, saved decline, reopening Privacy settings, and safe fallback.
5. Run `pnpm verify` and a Wrangler dry-run or equivalent configuration validation available in the project.

## Deployment and Free-plan fit

Cloudflare static-asset requests remain free and unlimited. One lightweight Worker request is made for each production page initialization, counting against the Workers Free-plan allowance of 100,000 requests per day and 10 ms CPU per request. The endpoint performs only property reads and set membership checks, so its CPU use is negligible for this site.

The Worker route is limited to `/api/*` so normal page assets do not consume Worker invocations. No paid Cloudflare feature, database, KV namespace, Durable Object, or third-party geolocation service is required.
