import conf from "conf";
import queryString from "query-string";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleButton from "src/components/GoogleButton";
import Logo from "src/components/Logo";
import UserContext from "src/contexts/UserContext";
import googleIcon from "src/img/google.png";
const debug = require("debug")("app:pages:Login");

//Can set "route" and "msg" with query params
export default function Login() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = queryString.parse(location.search);

  useEffect(() => {
    if (user && user.type === "organizer") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    debug(params);
  }, [params]);

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <Helmet>
        <title>Login | {conf.get("PROJECT_NAME")}</title>
      </Helmet>
      <Logo className="mt-6 mx-8" urlOnClick={conf.get("LANDING_URL")} />
      <div className="w-full flex-1 flex items-center justify-center mb-20">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-11/12 md:w-full max-w-lg relative border border-gray-200 bg-white px-8 py-8 rounded-lg">
            <div className="font-medium text-2xl mb-4">
              Login or Sign up for free
            </div>
            <GoogleButton>
              <div className="flex items-center">
                <div className="bg-white px-1 py-1 rounded">
                  <img src={googleIcon} className="w-5 h-auto" />
                </div>
                <p className="ml-3 text-white font-medium text-lg">
                  Continue with Google
                </p>
              </div>
            </GoogleButton>
          </div>
        </div>
      </div>
    </div>
  );
}
