import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react";
import { AxiosError } from "axios";
import { AppDispatch } from "./store";

const debug = require("debug")("app:redux:Notification");

export enum NOTIF_STATE {
  TOAST = "NOTIF_TOAST",
  DUPLICATE_USER = "NOTIF_DUPLICATE_USER",
  SCREENSHARE_ERROR = "NOTIF_SCREENSHARE_ERROR",
  SCREENSHARE_USER_BLOCK = "NOTIF_SCREENSHARE_USER_BLOCK",
}

interface NotificationError {
  type: NOTIF_STATE | null;
  message: string | null;
}

interface NotificationState {
  error: NotificationError;
}

const initialState: NotificationState = {
  error: {
    type: null,
    message: null,
  },
};

const NotificationSlice = createSlice({
  name: "notif",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<NotificationError>) {
      //assuming this is better than setting the entire object as it might avoid rerender/dispatch
      state.error.type = action.payload.type;
      state.error.message = action.payload.message;
    },
  },
});

export const { setError } = NotificationSlice.actions;

export interface NotificationExtraData {
  recommend?: string;
  notifType?: NOTIF_STATE | null;
  extraData?: Record<string, unknown>;
}

export const logErrorMessage =
  (
    message: string,
    argOpts: Pick<NotificationExtraData, "notifType" | "extraData"> = {}
  ) =>
  (dispatch: AppDispatch) => {
    const opts = {
      notifType: NOTIF_STATE.TOAST,
      ...argOpts,
    };

    // window.message = message;
    console.error(message, opts.extraData);
    Sentry.captureMessage(message, { extra: opts.extraData });

    if (opts.notifType === NOTIF_STATE.TOAST) {
      dispatch(setError({ type: NOTIF_STATE.TOAST, message }));
    }
  };

export const logAxiosError =
  (err: AxiosError, failedEvent: string, argOpts: NotificationExtraData = {}) =>
  (dispatch: AppDispatch) => {
    debug("Log axios error", err, failedEvent, argOpts);
    const opts = {
      recommend: "try again or contact support",
      notifType: NOTIF_STATE.TOAST,
      extraData: undefined,
      ...argOpts,
    };

    // window.err = err;
    console.error(failedEvent, err, opts.extraData);
    Sentry.captureException(err, { extra: { failedEvent, ...opts.extraData } });

    if (opts.notifType == NOTIF_STATE.TOAST) {
      let recommend: string | null = opts.recommend;
      let errMsg;
      if (err.response) {
        //4xx/5xx server error
        // console.log(err.response.headers);
        if (err.response.status === 401) {
          recommend =
            "you may have logged out in a different tab and should refresh";
          errMsg = err.response.data;
          // } else if (err.response.status === 422) {
          //   console.error("Full Err Response Data", err.response.data);
          //   errMsg = traverseChangesetError(err.response.data);
        } else {
          const rawData =
            err.response &&
            err.response.data &&
            JSON.stringify(err.response.data);
          //this length check handles when it returns HTML pages
          const data =
            typeof rawData === "string" && rawData.length > 255
              ? "[Long Error]"
              : rawData;

          console.error("Full Err Response Data", err.response.data);

          errMsg = `${err.response.status}: ${data}`;
        }
      } else if (err.request) {
        // request made without response
        recommend = null;
        errMsg = "Server never responded";
      } else if (err.message === "Network Error") {
        console.error("Full Err message", err.message);
        //Special error, nointernet boundary will kick them so just handle server mistakes
        errMsg = err.message && err.message.length > 255 ? "" : err.message; //this handles when it returns HTML pages
      } else {
        console.error("Full Err message", err.message);
        //something while setting up request
        errMsg = err.message && err.message.length > 255 ? "" : err.message; //this handles when it returns HTML pages
      }

      const message = `${failedEvent} failed${
        recommend ? ", " + recommend : ""
      } – ${errMsg}`;
      Sentry.captureMessage(message, { extra: opts.extraData });
      dispatch(setError({ type: NOTIF_STATE.TOAST, message }));
    }
  };

export default NotificationSlice.reducer;
