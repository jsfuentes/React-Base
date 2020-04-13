import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";

import Router from "./Router";
import * as serviceWorker from "./serviceWorker";
import "./styles/tailwind.css";
import conf from "conf";

if (process.env.NODE_ENV !== "production") {
  localStorage.debug = "app:*";
} else {
  localStorage.debug = null; //Set to null to not print in prod
  localStorage.debug = "app:*";

  //check for existence because optional
  if (conf.has("SENTRY_DNS") && conf.get("SENTRY_DNS") !== "") {
    Sentry.init({ dsn: conf.get("SENTRY_DNS") });
  }
}

ReactDOM.render(<Router />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
