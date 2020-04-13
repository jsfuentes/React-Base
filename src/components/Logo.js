import React from "react";
import PropTypes from "prop-types";

function Logo(props) {
  return (
    <a className="flex items-center" href="/">
      <img
        className="w-9 h-9"
        src={require("img/logo.png")}
        alt="Modulo Logo"
      />
      {props.showName && (
        <span className="text-black-2 text-sm sm:text-base font-medium sm:font-medium ml-3 sm:ml-5 tracking-modulo justify-center">
          MODULO
        </span>
      )}
    </a>
  );
}

Logo.propTypes = {
  showName: PropTypes.bool,
};

Logo.defaultProps = {
  showName: true,
};

export default Logo;
