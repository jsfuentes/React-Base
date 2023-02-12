import conf from "conf";
import { useCallback, useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { axios } from "src/api/axios";
import Button from "src/components/Button";
import Footer from "src/components/Footer";
import Navbar from "src/components/Navbar";
import UserContext from "src/contexts/UserContext";
import { useAppDispatch } from "src/redux/hooks";
import { logErrorMessage } from "src/redux/notification";
const debug = require("debug")("app:Landing");

export default function Landing() {
  const { user } = useContext(UserContext);
  const [resp, setResp] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    axios
      .get("/api")
      .then((response) => {
        debug("Landing Page response", response);
        setResp(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const onClickSample = useCallback(async () => {
    if (!user?.id) {
      dispatch(logErrorMessage("You need to be logged in"));
      return;
    }

    alert("Do something.....");
  }, [dispatch, user?.id]);

  return (
    <>
      <Helmet>
        <title>{conf.get("PROJECT_NAME")}</title>
      </Helmet>

      <Navbar>
        <Link to="/dashboard" className="font-medium mx-2">
          Dashboard
        </Link>
        <Link to="/login" className="font-medium mx-2">
          Login
        </Link>
      </Navbar>

      <div className="w-full p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl flex flex-row font-bold mb-4">
            <div className="bx bx-rocket animate-wiggle text-black mx-1" />{" "}
            Welcome to React Base BB
          </div>
          <Button onClick={onClickSample}>
            Start Brainstorming Together
            <i className="bx bx-right-arrow-alt ml-1" />
          </Button>
          <div className="text-2xl font-bold my-4">
            {resp ? `The Server Says "${resp}"` : "The Server Can't Be Reached"}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
