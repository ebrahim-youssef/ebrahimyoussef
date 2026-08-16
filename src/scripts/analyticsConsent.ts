export type AnalyticsConsent = 'accepted' | 'declined';
export type AnalyticsStorage = 'granted' | 'denied';

export interface AnalyticsBootstrap {
  defaultAnalyticsStorage: AnalyticsStorage;
  grantAfterLoad: boolean;
  showPrompt: boolean;
  showSettings: boolean;
}

export function getAnalyticsBootstrap(
  requiresConsent: boolean,
  savedConsent: AnalyticsConsent | null,
): AnalyticsBootstrap {
  if (!requiresConsent) {
    return {
      defaultAnalyticsStorage: 'granted',
      grantAfterLoad: false,
      showPrompt: false,
      showSettings: false,
    };
  }

  if (savedConsent === 'accepted') {
    return {
      defaultAnalyticsStorage: 'denied',
      grantAfterLoad: true,
      showPrompt: false,
      showSettings: true,
    };
  }

  if (savedConsent === 'declined') {
    return {
      defaultAnalyticsStorage: 'denied',
      grantAfterLoad: false,
      showPrompt: false,
      showSettings: true,
    };
  }

  return {
    defaultAnalyticsStorage: 'denied',
    grantAfterLoad: false,
    showPrompt: true,
    showSettings: false,
  };
}
