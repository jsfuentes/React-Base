import React from "react";

import Logo from "img/logo.png";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <img className="w-10 h-auto" src={Logo} alt="Loading Icon" />
    </div>
  );
}
