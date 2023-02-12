import queryString from "query-string";
import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "src/components/Loading";
import UserContext from "src/contexts/UserContext";

const debug = require("debug")("app:components:UserRoute");

interface UserRouteProps {
  required: boolean;
  requiredOrganizer: boolean;
}

UserRoute.defaultProps = {
  required: false,
  requiredOrganizer: false,
};

//Ensure User is defined before ac cessing route, add required to ensure a registered user exists
export default function UserRoute(props: UserRouteProps) {
  const { required, requiredOrganizer } = props;
  const { user, userLoading } = useContext(UserContext);
  const location = useLocation();

  const redirectParams = queryString.stringify({
    route: location.pathname,
    msg: "Please login to view this page",
  });

  const failedRequired =
    !userLoading &&
    (!user || user.type === "anon") &&
    (required || requiredOrganizer);
  const failedRequiredOrganizer =
    !userLoading && (!user || user.type === "registered") && requiredOrganizer;

  useEffect(() => {
    if (failedRequired) {
      toast("Please login to view this page");
    } else if (failedRequiredOrganizer) {
      toast(
        "This account has not been whitelisted yet, try another email or request access on our homepage. If you're joining a session, then this is the wrong login and you should click on the session link."
      );
    }
  }, [failedRequired, failedRequiredOrganizer]);

  if (userLoading) {
    debug("LOADINGGG");
    return <Loading />;
  } else if (failedRequired || failedRequiredOrganizer) {
    debug("Navigation Debug - UserRoute to landing");
    return <Navigate to="/login" />;
  } else {
    debug("LOADED");
    return <Outlet />;
  }
}
