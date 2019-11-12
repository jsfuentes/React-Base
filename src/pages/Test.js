import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { axios } from "utils.js";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

export default function Test() {
  axios.get("/event").then(data => console.log(data));

  return (
    <>
      <Navbar />
      <div className="w-full h-screen p-8">
        <div className="px-4 pb-4 flex flex-col justify-center items-center">
          <div className="text-4xl block font-bold pb-2">Hello to React</div>
        </div>
      </div>
      <Footer />
    </>
  );
}
