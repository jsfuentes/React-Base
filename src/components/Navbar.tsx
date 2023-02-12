import classNames from "classnames";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";

const debug = require("debug")("app:Navbar");

interface NavbarProps {
  children?: React.ReactNode;
  left?: React.ReactNode;
  center?: React.ReactNode;
  bottom?: React.ReactNode;
  className?: string;
}

export default function Navbar(props: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let isScrolling: NodeJS.Timeout;

    function onScroll() {
      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends
      isScrolling = setTimeout(function () {
        const end = window.pageYOffset;
        if (end > 0) setScrolled(true);
        else setScrolled(false);
      }, 10);
    }

    // Listen for scroll events
    window.addEventListener("scroll", onScroll, false);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={classNames({
        "flex items-center justify-between flex-none w-full transition duration-100 ease-in-out":
          true,
        "z-100 sticky top-0 left-0 text-black bg-transparent h-16 border-b border-transparent ease-in-out px-2":
          true,
        [props.className || ""]: props.className,
      })}
      style={{
        backgroundColor: `${scrolled && "rgba(256, 256, 256, 0.9)"}`,
        backdropFilter: `${scrolled && "blur(7px)"}`,
        WebkitBackdropFilter: `${scrolled && "blur(7px)"}`,
      }}
    >
      <div className="flex flex-col w-full gap-1">
        <div className={`flex items-center justify-between w-full`}>
          <div className="flex-1">{props.left}</div>
          {props.center}
          <div className="text-right flex-1">{props.children}</div>
        </div>
        {props.bottom}
      </div>
    </nav>
  );
}
