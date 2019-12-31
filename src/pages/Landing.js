import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { axios } from "utils.js";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

export default function Landing() {
  const [resp, setResp] = useState("");
  useEffect(() => {
    axios
      .get("/test")
      .then(response => {
        console.log("Haha", response);
        setResp(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar>
        <Link to="/login" className="navlink">
          Login
        </Link>
      </Navbar>

      <div className="w-full p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl block font-bold mb-4">
            Welcome to React Base
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
            type="button"
          >
            Useless Button
          </button>
          <div className="text-2xl block font-bold mb-4">
            {resp ? `The Server Says "${resp}"` : "The Server Can't Be Reached"}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
