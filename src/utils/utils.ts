import * as Sentry from "@sentry/react";
import Bowser from "bowser";
import conf from "conf";

const debug = require("debug")("app:utils");

export const inDev = process.env.NODE_ENV !== "production";
//assuming the staging environment has a render.com domain
export const inStaging = conf.get("SERVER_URL").includes(".onrender.com");
export const inProd = !inDev && !inStaging;

const browser = Bowser.parse(window.navigator.userAgent);

if (browser.platform.type === "undefined") {
  Sentry.captureMessage("Unknown platform", { extra: { browser } });
}

export const isWindows = browser.os.name === "Windows";
export const isMobileWebview =
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
export const isMacOS = browser.os.name === "macOS";
export const isIOS = browser.os.name === "iOS";

// Ipad's have same useragent as desktop - https://stackoverflow.com/questions/57776001/how-to-detect-ipad-pro-as-ipad-using-javascript
export const isIpadPro =
  isMacOS && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
export const isTablet = browser.platform.type === "tablet";
// can be tablet or mobile
export const isDesktop =
  !isIpadPro && (browser.platform.type === "desktop" || !browser.platform.type);

//From this list: https://github.com/lancedikson/bowser/blob/master/src/constants.js
export const isChrome = browser.browser.name === "Chrome";
export const isFirefox = browser.browser.name === "Firefox";
export const isEdge = browser.browser.name === "Microsoft Edge";
export const isSafari = browser.browser.name === "Safari";

// export const isSupportedDesktopBrowser =
//   isChrome || isFirefox || isEdge || isSafari;
// export const isSupportedMobileBrowser =
//   isIOS || isIpadPro ? isSafari || isChrome : isChrome || isFirefox || isEdge;
