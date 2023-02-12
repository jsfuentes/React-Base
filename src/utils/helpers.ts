import * as Sentry from "@sentry/react";
import { ComponentType } from "react";

const debug = require("debug")("app:utils:helpers");

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//TODO: Figure out these module/error types
export function componentLoader(
  componentImport: () => any
): Promise<{ default: ComponentType<any> }> {
  return new Promise((resolve, reject) => {
    function attemptLoad(attemptsLeft = 2) {
      // debug("ATTEMPT LOAD", attemptsLeft);
      componentImport()
        .then((e: { default: ComponentType<any> }) => {
          // debug("THEN", e);
          resolve(e);
        })
        //errors in prod if new version/filenames pushed or in dev if no file or haven't npm installed all modules
        .catch((err: any) => {
          Sentry.captureException(err);
          console.error("Lazy Loading Failed", err);

          if (attemptsLeft === 1) {
            console.error("Lazy Loading Failed Reloading Page", err);
            Sentry.captureMessage("Lazy Loading Failed Reloading Page");
            window.location.reload(); //instead of reject reload
            // reject(err);
            return;
            //no reject let the page reload with the loading icon showing from Suspense
          }

          // let us retry after 500 ms
          setTimeout(() => {
            attemptLoad(attemptsLeft - 1);
          }, 500);
        });
    }

    attemptLoad();
  });
}

export function copyToClipboard(str: string) {
  const el = document.createElement("textarea"); // Create a <textarea> element
  el.value = str; // Set its value to the string that you want copied
  el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
  el.style.position = "absolute";
  el.style.left = "-9999px"; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selection = document.getSelection();
  const selected =
    selection && selection.rangeCount > 0 // Check if there is any content selected previously
      ? selection.getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    const selection2 = document.getSelection();
    if (selection2) {
      // If a selection existed before copying
      selection2.removeAllRanges(); // Unselect everything on the HTML document
      selection2.addRange(selected); // Restore the original selection
    }
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
