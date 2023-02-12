import * as Sentry from "@sentry/react";
const debug = require("debug")("app:utils:time");

export function secondsToString(secs: number): string {
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  let timeStr = "";
  if (hours > 0) {
    timeStr += `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  if (minutes > 0) {
    timeStr += timeStr === "" ? "" : " ";
    timeStr += `${minutes} min${minutes === 1 ? "" : "s"}`;
  }
  return timeStr;
}

export function secondsToHighlyRoundedString(secs: number): string {
  const days = Math.floor(secs / (3600 * 24));
  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);

  if (days > 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }
  if (hours > 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (secs > 10) {
    return "less than a minute ago";
  }

  return "a few seconds ago";
}

// expects end_time and start_time and returns duration in seconds
// export function eventToDuration(
//   event: SlingShowEvent | SlingShowSubevent | SlingShowFormEvent
// ): number {
//   if (!event || !event.end_time || !event.start_time) {
//     return -1;
//   }
//
//   return (+new Date(event.end_time) - +new Date(event.start_time)) / 1000;
// }

//weird sentry error for this girl in Taiwan - https://sentry.io/organizations/slingshow/issues/1938098845/events/cb98f25eee9d42ccab4d46b47938c528/?project=5265091
// EDT
export function getTimezone(): string {
  try {
    try {
      const tz = new Date()
        .toLocaleTimeString("en-us", { timeZoneName: "short" })
        .split(" ")[2];
      return tz;
    } catch (err) {
      console.error(
        "Date:",
        new Date(),
        new Date().toLocaleTimeString("en-us", { timeZoneName: "short" })
      );
      Sentry.captureException(err);
    }
  } catch (err) {
    //to catch some localetimestring failure
    Sentry.captureException(err);
  }
  return "Local Time";
}

// "America/New_York"
export function getPlaceTimezone(): string | null {
  return typeof Intl === "object"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : null;
}

export function roundUp(value: number, factor = 1): number {
  return Math.ceil(value / factor) * factor;
}

export function getClockFormattedTime(
  secs: number,
  showEmptyHours = false
): string {
  let isNegative = false;
  //no need for decimal places in this string
  secs = Math.round(secs);
  if (secs < 0) {
    isNegative = true;
    secs = secs * -1;
  }

  const hours = Math.floor(secs / (60 * 60));
  const divisor_for_minutes = secs % (60 * 60);
  const minutes = Math.floor(divisor_for_minutes / 60);
  const seconds = secs % 60;

  let clockString = "";
  if (isNegative) {
    clockString = "-";
  }
  if (hours) {
    clockString += minTwoDigits(hours) + ":";
  } else if (showEmptyHours) {
    clockString += "00:";
  }

  clockString += `${minTwoDigits(minutes)}:${minTwoDigits(seconds)}`;
  // debug("getClockFormattedTime", {
  //   secsin: secs,
  //   hours,
  //   minutes,
  //   seconds,
  //   clockString,
  // });
  return clockString;
}

function minTwoDigits(num: number) {
  return ("0" + num).slice(-2);
}

export function clockFormattedToSeconds(clockString: string) {
  let hrs = 0;
  let mins = 0;
  let secs = 0;
  const parts = clockString.split(":");
  if (parts.length === 3) {
    hrs = parseInt(parts[0]);
    mins = parseInt(parts[1]);
    secs = parseInt(parts[2]);
  } else if (parts.length === 2) {
    mins = parseInt(parts[0]);
    secs = parseInt(parts[1]);
  } else {
    console.error("Failed to parse clockString", clockString);
  }

  return hrs * 60 * 60 + mins * 60 + secs;
}

export function secondsToTimerFormat(secs: number): string {
  if (secs < 0) {
    secs = secs * -1;
  }

  const minutes = Math.min(Math.floor(secs / 60), 99);
  const seconds = secs % 60;

  let timerString = "";

  timerString += `${minTwoDigits(minutes)}:${minTwoDigits(seconds)}`;
  return timerString;
}

export function secondsToHms(d: number) {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor((d % 3600) % 60);
  const hDisplay =
    h > 0 ? h + (h == 1 ? " hr" : " hrs") + (m > 0 || s > 0 ? ", " : "") : "";
  const mDisplay =
    m > 0 ? m + (m == 1 ? " min" : " mins") + (s > 0 ? ", " : "") : "";
  const sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
  return hDisplay + mDisplay + sDisplay;
}
