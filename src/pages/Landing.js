import React from "react";
import { Link } from "react-router-dom";

import { axios } from "utils.js";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

export default function Landing() {
  axios.get("/event").then(data => console.log(data.data));

  return (
    <>
      <Navbar>
        <Link
          to="/jfuentes/relearning-react-with-react-hooks"
          className="navlink"
        >
          Read Article
        </Link>
      </Navbar>

      <div className="w-full h-screen p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl block font-bold pb-2">Hello to React</div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Click me?
          </button>
          <div className="text-2xl block font-bold pb-2">It is {Date()}.</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
