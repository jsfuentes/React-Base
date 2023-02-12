import conf from "conf";
import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import IntercomButton from "src/components/IntercomButton";
import UserContext from "src/contexts/UserContext";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { NOTIF_STATE, setError } from "src/redux/notification";

const debug = require("debug")("app:ErrorManager");

interface ErrorManagerProps {
  children: React.ReactNode;
}

export default function ErrorManager(props: ErrorManagerProps) {
  const { logout } = useContext(UserContext);
  //separate so if type and message don't change(duplicate doesn't cause a rerender)
  const errorType = useAppSelector((state) => state.notification.error.type);
  const errorMessage = useAppSelector(
    (state) => state.notification.error.message
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (errorType || errorMessage) {
      debug("error", errorType, errorMessage);
      if (errorType === NOTIF_STATE.TOAST) {
        toast(errorMessage);

        //clear error after 5 seconds so if same error can toast for message
        const timeoutId = setTimeout(
          () => dispatch(setError({ type: null, message: null })),
          5000
        );
        return () => clearTimeout(timeoutId);
      }
    }
  }, [dispatch, errorType, errorMessage]);

  switch (errorType) {
    case NOTIF_STATE.DUPLICATE_USER:
      return (
        <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
          <div className="container flex flex-col items-center justify-center">
            <div className="text-6xl font-bold mb-6">
              Pardon the Interruption
            </div>
            <div className="text-4xl mb-4">
              Looks like you're already in this {conf.get("PROJECT_NAME")} event
              in another browser or tab. Please close any extra browsers or
              tabs, then reload this page.
            </div>
            <div className="flex items-center justify-center mt-4">
              {logout && (
                <a
                  className="text-sm text-gray-500 hover:text-gray-200 cursor-pointer"
                  onClick={() => logout(true)}
                >
                  Sign in with another account
                </a>
              )}
              <IntercomButton className="ml-3" />
            </div>
          </div>
        </div>
      );
    default:
      return <>{props.children}</>;
  }
}
