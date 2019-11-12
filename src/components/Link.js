import React from "react";
import PropTypes from "prop-types";
import { ArrowUpRight } from "react-feather";

function Link(props) {
  return (
    <div className="flex justify-center items-start group font-medium">
      <a href={props.href} className="flex justify-center">
        {props.children}
      </a>
      <div className="-mt-3">
        <ArrowUpRight
          style={{ strokeWidth: "2.25px" }}
          className="w-5 h-auto mt-2px"
        />
      </div>
    </div>
  );
}

Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.any
};

export default Link;
