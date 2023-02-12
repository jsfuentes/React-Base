export {};

declare global {
  interface Window {
    // https://github.com/microsoft/TypeScript/issues/31686
    webkitAudioContext: typeof AudioContext;
    analytics: SegmentAnalytics.AnalyticsJS;
    Intercom: Intercom_.IntercomCommand;
  }

  interface Navigator {
    deviceMemory?: number;
  }
}
