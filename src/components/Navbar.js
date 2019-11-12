import React from "react";

import PropTypes from "prop-types";
import Logo from "./Logo";

const Navbar = props => {
  return (
    <div className="container mx-auto pt-5 flex justify-between items-center ">
      <Logo />
      <div>{props.children}</div>
    </div>
  );
};

Navbar.propTypes = {
  children: PropTypes.any
};

export default Navbar;
