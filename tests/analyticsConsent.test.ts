import { expect, it } from 'vitest';
import { getAnalyticsBootstrap, type AnalyticsBootstrap, type AnalyticsConsent } from '../src/scripts/analyticsConsent';

const cases: Array<[boolean, AnalyticsConsent | null, AnalyticsBootstrap]> = [
  [
    false,
    null,
    {
      defaultAnalyticsStorage: 'granted',
      grantAfterLoad: false,
      showPrompt: false,
      showSettings: false,
    },
  ],
  [
    true,
    null,
    {
      defaultAnalyticsStorage: 'denied',
      grantAfterLoad: false,
      showPrompt: true,
      showSettings: false,
    },
  ],
  [
    true,
    'accepted',
    {
      defaultAnalyticsStorage: 'denied',
      grantAfterLoad: true,
      showPrompt: false,
      showSettings: true,
    },
  ],
  [
    true,
    'declined',
    {
      defaultAnalyticsStorage: 'denied',
      grantAfterLoad: false,
      showPrompt: false,
      showSettings: true,
    },
  ],
];

it.each(cases)('returns the bootstrap state for region=%s consent=%s', (region, consent, expected) => {
  expect(getAnalyticsBootstrap(region, consent)).toEqual(expected);
});
