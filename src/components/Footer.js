import React from "react";
import moment from "moment";
import HeartImg from "img/heart.png";
// import GlobeImg from "img/globe.png";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-200 w-full h-auto py-12">
      <div className="container mx-auto">
        <div className="flex justify-center sm:justify-start">
          <Logo />
        </div>
        <p className="flex justify-center sm:justify-start items-center mt-8 mb-4 text-gray-700">
          <span>Made with</span>{" "}
          <img
            className="inline w-4 h-auto mx-5px"
            src={HeartImg}
            alt="Heart"
          />
          <span>on Earth</span>
        </p>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          © {moment().year()} Modulo Inc.
        </p>
      </div>
    </footer>
  );
}
