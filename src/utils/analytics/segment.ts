/* global analytics */
import { tryUntilWorks } from "src/utils/analytics/analytics";
import { inProd } from "src/utils/utils";
const debug = require("debug")("app:utils:segment");

const SEGMENT_ACTIVE = inProd;
// const SEGMENT_ACTIVE = true;
let isUserActive = false;

// SEGMENT
export function segmentIdentify(user: User) {
  if (!SEGMENT_ACTIVE) return;
  if (!user || !user.id || user.type !== "organizer") {
    return;
  }

  function f() {
    analytics.identify(user.id, user);
    isUserActive = true;
    // analytics.group(user.organization_id);
  }

  tryUntilWorks(f, "Segment Identify");
}

export function segmentUserAction(
  action: string,
  info?: Record<string, unknown>
) {
  if (!SEGMENT_ACTIVE || !isUserActive) return;

  function f() {
    if (info) {
      analytics.track(action, info);
    } else {
      analytics.track(action, {});
    }
  }

  tryUntilWorks(f, "Segment User Action");
}

export function segmentPage() {
  if (!SEGMENT_ACTIVE || !isUserActive) return;

  function f() {
    analytics.page();
  }

  tryUntilWorks(f, "Segment Page Track");
}
