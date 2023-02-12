import conf from "conf";
import React, { useContext, useState } from "react";
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from "react-google-login";
import AuthService from "src/api/AuthService";
import Button, {
  ButtonSizeOptions,
  ButtonVariantOptions,
} from "src/components/Button";
import UserContext from "src/contexts/UserContext";
import { useAppDispatch } from "src/redux/hooks";
import { logErrorMessage } from "src/redux/notification";
const debug = require("debug")("app:components:GoogleLogin");

interface GoogleButtonProps {
  children: React.ReactNode;
  params: LoginParams;

  //Button props
  variant?: ButtonVariantOptions;
  size?: ButtonSizeOptions;
  isButton?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

GoogleButton.defaultProps = {
  variant: "google",
  isButton: true,
  params: {},
};

//Can set "route" and "msg" with query params
export default function GoogleButton(props: GoogleButtonProps) {
  const { user, userLoading } = useContext(UserContext);
  const [useRedirectLogin, setUseRedirectLogin] = useState(false);
  const dispatch = useAppDispatch();

  async function redirectLogin() {
    if (!user) {
      dispatch(
        logErrorMessage(
          "Failed to properly init user, refresh and try again or contact support"
        )
      );
      return;
    }

    try {
      const onAuthResp = await AuthService.onAuth({
        ...props.params,
        id: user.id,
      });
      debug("Redirect login", onAuthResp);
      window.location.href = `${window.location.origin}/auth/google`;
    } catch (err) {
      debug("On auth failure");
    }
  }

  //user already exists when clicked as it is disabled when userloading
  //any is literally the error signature
  async function onSignIn(
    googleUser: GoogleLoginResponse | GoogleLoginResponseOffline | any
  ) {
    if (googleUser.error) {
      if (googleUser.error === "popup_closed_by_user") {
        return;
      }

      if (
        googleUser.error === "idpiframe_initialization_failed" &&
        (googleUser.details ===
          "Cookies are not enabled in current environment." ||
          googleUser.details === "R")
      ) {
        debug("Third party cookies disabled, probably incognito");
      } else {
        dispatch(
          logErrorMessage("Failed to GoogleButton Login", {
            notifType: null,
            extraData: googleUser,
          })
        );
      }

      setUseRedirectLogin(true);
      return;
    }

    if (!user || !user.id) {
      dispatch(
        logErrorMessage(
          "Failed to GoogleButton Login because user not loaded",
          {
            notifType: null,
            extraData: { googleUser, user },
          }
        )
      );
      return;
    }

    if (!googleUser.accessToken) {
      dispatch(
        logErrorMessage("Failed to fetch google access token", {
          notifType: null,
          extraData: { googleUser, user },
        })
      );
      return;
    }

    // debug("GUSER", googleUser, googleUser.accessToken);
    try {
      const onAuthResp = await AuthService.onAuth({
        ...props.params,
        id: user.id,
      });
      debug("Redirect login", onAuthResp);
    } catch (err) {
      debug("On auth failure");
    }

    const urlSearch = new URLSearchParams({
      gaccess_token: googleUser.accessToken,
      id: user.id,
    }).toString();

    window.location.href = `${window.location.origin}/auth/google_login?${urlSearch}`;
  }

  return (
    <GoogleLogin
      clientId={conf.get("GOOGLE_CLIENT_ID")}
      buttonText="Login"
      onSuccess={onSignIn}
      onFailure={onSignIn}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => {
        function onButtonClick() {
          //button should wait until user.id retrieved as well
          //instead of disabled for common onClick between this and span
          if (!useRedirectLogin && (renderProps.disabled || userLoading)) {
            debug("Ignoring googlelogin click while loading", {
              useRedirectLogin,
              renderDisabled: renderProps.disabled,
              userLoading: userLoading,
            });
            return;
          }

          useRedirectLogin ? redirectLogin() : renderProps.onClick();
        }

        return (
          <>
            {props.isButton ? (
              <Button
                variant={props.variant}
                size={props.size}
                fullWidth={props.fullWidth}
                style={props.style}
                onClick={onButtonClick}
              >
                {props.children}
              </Button>
            ) : (
              <span
                onClick={onButtonClick}
                className="cursor-pointer py-1.5 text-sm font-medium text-gray-300 hover:text-white outline-none active:outline-none border-none"
              >
                {props.children}
              </span>
            )}
          </>
        );
      }}
    />
  );
}
