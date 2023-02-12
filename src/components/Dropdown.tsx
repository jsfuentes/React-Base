import classNames from "classnames";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "src/utils/hooks";

const debug = require("debug")("app:Dropdown");

interface DropdownProps {
  hoverElement: React.ReactNode;
  hoverPlace: "bottom" | "top";
  type: "hover" | "click";
  children: React.ReactNode;

  // animate: PropTypes.bool,
  closeOnClick?: boolean;
  hoverSize?: string; //null makes w-56
  showChild?: boolean;
  outerCls?: string;
  otherCls?: string;
  className?: string;
  active?: boolean;
}

Dropdown.defaultProps = {
  type: "hover",
  hoverPlace: "bottom",
  hoverSize: "w-56",
  showChild: true,
  // animate: false, //doesn't work properly if click and showChild becomes false
  closeOnClick: true,
};

export default function Dropdown(props: DropdownProps) {
  const [active, setActive] = useState(props.active);
  const dropDownR = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActive(props.active);
  }, [props.active]);

  const exitDropdown = useCallback(() => {
    setActive(false);
  }, []);

  useClickOutside(
    dropDownR,
    exitDropdown,
    Boolean(active && props.type === "click")
  );

  return (
    <div
      className={classNames({
        "relative text-left": true,
        [props.outerCls || ""]: props.outerCls,
      })}
      {...(props.type === "hover"
        ? {
            onMouseEnter: () => setActive(true),
            onMouseLeave: () => setActive(false),
          }
        : {})}
    >
      {active && (
        <div
          className={classNames({
            "absolute overflow-hidden rounded-lg z-[150]": true,
            //had to remove so wouldn't overflow(just clickable) in Safari
            // //https://css-tricks.com/using-css-transitions-auto-dimensions/, use maxheight to allow auto height and animation
            // "transition-all duration-500 ease-linear": props.animate,
            // "max-h-0": !active,
            // "max-h-screen": active,
            "bottom-0": props.hoverPlace === "top",
            [props.className || ""]: props.className,
          })}
          ref={dropDownR}
          onClick={() => props.closeOnClick && setActive(false)}
        >
          <div
            className={classNames({
              "rounded-lg z-50 bg-white": true,
              [props.hoverSize || ""]: props.hoverSize,
            })}
          >
            {props.hoverElement}
          </div>
        </div>
      )}
      <div
        className={classNames({
          "w-full h-full": true,
          [props.otherCls || ""]: props.otherCls,
        })}
        {...(props.type === "click"
          ? {
              onClick: (e) => {
                e.stopPropagation();
                setActive(!active);
                debug("SETTING OPPSITE ACTIVE", !active);
              },
            }
          : {})}
      >
        {(props.showChild || active) && props.children}
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon?: string;
  onClick?: () => void;
  href?: string;
  newTab?: boolean;
  children: React.ReactNode;
}

export function MenuItem(props: MenuItemProps) {
  return (
    <a
      {...(props.onClick
        ? {
            onClick: (e) => {
              e.stopPropagation();
              props.onClick && props.onClick();
            },
          }
        : {})}
      {...(props.newTab ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(props.href ? { href: props.href } : {})}
      className="font-medium w-full py-0.5 flex items-center px-2.5 cursor-pointer  hover:bg-primary-100 hover:text-primary-500 transition duration-200 ease-in-out"
    >
      {props.icon && <i className={`${props.icon} mr-2.5 text-lg`} />}
      {props.children}
    </a>
  );
}

interface MenuContainerProps {
  children: React.ReactNode;
}

export function MenuContainer(props: MenuContainerProps) {
  return (
    <div className="py-1.5 rounded-lg text-sm border border-gray-200 bg-white text-gray-700 flex flex-col">
      {props.children}
    </div>
  );
}
