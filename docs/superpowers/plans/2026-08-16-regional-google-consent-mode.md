# Regional Google Analytics Consent Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run normal GA4 analytics outside the EEA, UK, and Switzerland while using cookieless Advanced Consent Mode until protected-region visitors accept analytics storage.

**Architecture:** A Cloudflare Worker exposes a no-store boolean region endpoint and otherwise delegates to the static-assets binding. The Astro analytics component fetches that boolean, computes a small deterministic bootstrap state, queues Consent Mode v2 defaults before loading `gtag.js`, and exposes consent controls only in protected regions.

**Tech Stack:** Astro 7, TypeScript, Vitest, Cloudflare Workers Static Assets, Google gtag.js Consent Mode v2

**Spec:** `docs/superpowers/specs/2026-08-16-regional-google-consent-mode-design.md`

## Global Constraints

- Google tag ID remains `G-JQEG0EKW4G`.
- `ad_storage`, `ad_user_data`, and `ad_personalization` remain denied globally.
- Protected regions are EU countries plus `IS`, `LI`, `NO`, `GB`, and `CH`.
- Missing or malformed geolocation fails safely to consent-required behavior.
- `/api/privacy-region` returns only `requiresConsent` and uses `Cache-Control: private, no-store`.
- Static assets bypass Worker execution; only `/api/*` runs Worker-first.
- Local Astro development remains analytics-free.

---

### Task 1: Cloudflare privacy-region endpoint

**Files:**
- Create: `worker/index.js`
- Modify: `wrangler.jsonc`
- Test: `tests/privacyRegion.test.ts`

**Interfaces:**
- Produces: `requiresConsent(cf): boolean`
- Produces: `handleRequest(request, env): Promise<Response>`
- Produces: `GET /api/privacy-region -> { requiresConsent: boolean }`

- [ ] **Step 1: Write the failing Worker tests**

Create `tests/privacyRegion.test.ts` with table-driven cases for an EU request, each non-EU protected code, `US`, and missing metadata. Add endpoint tests that define a synthetic `cf` property on `Request`, assert the exact JSON and `private, no-store`, assert POST returns 405 with `Allow: GET`, and assert a non-API request delegates once to `env.ASSETS.fetch`.

```ts
import { describe, expect, it, vi } from 'vitest';
import worker, { requiresConsent } from '../worker/index.js';

describe('requiresConsent', () => {
  it.each([
    [{ isEUCountry: '1', country: 'DE' }, true],
    [{ isEUCountry: '0', country: 'IS' }, true],
    [{ isEUCountry: '0', country: 'LI' }, true],
    [{ isEUCountry: '0', country: 'NO' }, true],
    [{ isEUCountry: '0', country: 'GB' }, true],
    [{ isEUCountry: '0', country: 'CH' }, true],
    [{ isEUCountry: '0', country: 'US' }, false],
    [undefined, true],
  ])('maps %o to %s', (cf, expected) => expect(requiresConsent(cf)).toBe(expected));
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/privacyRegion.test.ts`

Expected: FAIL because `worker/index.js` does not exist.

- [ ] **Step 3: Implement the Worker and static-assets configuration**

Create `worker/index.js` with a `Set` containing `IS`, `LI`, `NO`, `GB`, and `CH`. `requiresConsent` returns true for missing metadata, `isEUCountry === '1'`, or membership in that set. `handleRequest` serves the region JSON for GET, 405 for other methods, and otherwise calls `env.ASSETS.fetch(request)`.

Update `wrangler.jsonc`:

```jsonc
"main": "./worker/index.js",
"assets": {
  "directory": "./dist",
  "binding": "ASSETS",
  "run_worker_first": ["/api/*"]
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test tests/privacyRegion.test.ts`

Expected: all regional and endpoint tests pass.

- [ ] **Step 5: Commit the Worker deliverable**

```bash
git add worker/index.js wrangler.jsonc tests/privacyRegion.test.ts
git commit -m "feat: add regional privacy endpoint"
```

### Task 2: Consent bootstrap decision model

**Files:**
- Create: `src/scripts/analyticsConsent.ts`
- Test: `tests/analyticsConsent.test.ts`

**Interfaces:**
- Produces: `AnalyticsConsent = 'accepted' | 'declined'`
- Produces: `AnalyticsStorage = 'granted' | 'denied'`
- Produces: `getAnalyticsBootstrap(requiresConsent, savedConsent)` returning `defaultAnalyticsStorage`, `grantAfterLoad`, `showPrompt`, and `showSettings`.

- [ ] **Step 1: Write the failing decision-table test**

Create `tests/analyticsConsent.test.ts` with literal expected objects:

```ts
import { expect, it } from 'vitest';
import { getAnalyticsBootstrap } from '../src/scripts/analyticsConsent';

it.each([
  [false, null, { defaultAnalyticsStorage: 'granted', grantAfterLoad: false, showPrompt: false, showSettings: false }],
  [true, null, { defaultAnalyticsStorage: 'denied', grantAfterLoad: false, showPrompt: true, showSettings: false }],
  [true, 'accepted', { defaultAnalyticsStorage: 'denied', grantAfterLoad: true, showPrompt: false, showSettings: true }],
  [true, 'declined', { defaultAnalyticsStorage: 'denied', grantAfterLoad: false, showPrompt: false, showSettings: true }],
])('returns the bootstrap state for region=%s consent=%s', (region, consent, expected) => {
  expect(getAnalyticsBootstrap(region, consent)).toEqual(expected);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/analyticsConsent.test.ts`

Expected: FAIL because `analyticsConsent.ts` does not exist.

- [ ] **Step 3: Implement the pure decision function**

Implement the two string-union types, an `AnalyticsBootstrap` interface, and the four explicit branches described by the test table. Do not access DOM, storage, network, or Google APIs in this module.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test tests/analyticsConsent.test.ts`

Expected: all four decision paths pass.

- [ ] **Step 5: Commit the decision model**

```bash
git add src/scripts/analyticsConsent.ts tests/analyticsConsent.test.ts
git commit -m "test: define regional analytics bootstrap"
```

### Task 3: Advanced Consent Mode client integration

**Files:**
- Modify: `src/components/AnalyticsConsent.astro`
- Modify: `scripts/verify-build.mjs`

**Interfaces:**
- Consumes: `getAnalyticsBootstrap(requiresConsent, savedConsent)` from Task 2.
- Consumes: `GET /api/privacy-region` from Task 1.
- Produces: production client behavior that queues Consent Mode v2 defaults before `gtag('config', tagId)`.

- [ ] **Step 1: Add failing production-build assertions**

Extend `scripts/verify-build.mjs` to read generated JavaScript under `dist/_astro` and fail unless the built artifact contains `/api/privacy-region`, `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`. Remove the assertion that Google Analytics must never load before consent because Advanced Consent Mode intentionally loads it with storage denied.

- [ ] **Step 2: Run build verification and verify RED**

Run: `pnpm build && node scripts/verify-build.mjs`

Expected: FAIL because the production client does not contain `/api/privacy-region` or the Consent Mode v2 fields.

- [ ] **Step 3: Implement regional bootstrap and consent updates**

Update the consent copy to explain cookieless measurement and optional Analytics cookies. In the processed client script:

1. Fetch `/api/privacy-region` with a two-second `AbortController` timeout.
2. Validate that `requiresConsent` is boolean; otherwise return true.
3. Read the saved choice only for protected-region behavior.
4. Queue `gtag('consent', 'default', ...)` with all ad fields denied and the decision model's analytics default.
5. Queue `gtag('js', new Date())` and `gtag('config', tagId)` before appending the external script.
6. For saved acceptance, immediately queue a consent update granting only `analytics_storage`.
7. Outside protected regions, load full analytics without showing consent UI or Privacy settings.
8. On acceptance, grant only analytics storage; on decline, deny every field and clear `_ga` cookies without reloading.
9. On endpoint failure, use the protected-region path.

- [ ] **Step 4: Run focused production verification and Astro diagnostics**

Run: `pnpm build && node scripts/verify-build.mjs && pnpm astro check`

Expected: verifier passes and Astro reports zero errors, warnings, and hints.

- [ ] **Step 5: Commit the client integration**

```bash
git add src/components/AnalyticsConsent.astro scripts/verify-build.mjs
git commit -m "feat: enable regional advanced consent mode"
```

### Task 4: Final validation and release

**Files:**
- Modify only files required by failures found during validation.

**Interfaces:**
- Consumes all deliverables from Tasks 1–3.
- Produces a verified `main` branch pushed to `origin/main`.

- [ ] **Step 1: Run the full project gate**

Run: `pnpm verify`

Expected: all Vitest files pass, Astro diagnostics are clean, the production build succeeds, and the build verifier passes.

- [ ] **Step 2: Validate the Cloudflare bundle**

Run: `pnpm exec wrangler deploy --dry-run`

Expected: Wrangler accepts `worker/index.js`, the `ASSETS` binding, and the `/api/*` worker-first route without deploying.

- [ ] **Step 3: Review the final diff and repository state**

Run: `git diff --check && git status --short && git log -5 --oneline`

Expected: no whitespace errors; only intentional files are modified or the tree is clean after task commits.

- [ ] **Step 4: Push main and confirm synchronization**

Run: `git push origin main && git status --short --branch`

Expected: push succeeds and local `main` tracks `origin/main` with no ahead/behind marker.
