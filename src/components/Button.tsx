import classNames from "classnames";
import React, { MouseEventHandler, MutableRefObject } from "react";
const debug = require("debug")("app:components:Button");

export type ButtonSizeOptions = "xl" | "lg" | "md" | "sm" | "xs";

export type ButtonVariantOptions =
  | "primary" //primary(purple) with white text
  | "reverse-primary" // white bg with primary(purple) text
  | "secondary" // white bg with black txt
  | "tertiary" // black bg with white txt
  | "danger" //red bg and white txt
  | "google" // blue bg;
  | "sticky" // amber bg with white text;
  | "lightgray" // light gray bg with white text;
  | "inverse-lightgray"; // light gray border with light gray text;

interface ButtonProps {
  size: ButtonSizeOptions;
  variant: ButtonVariantOptions;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;

  type: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onMouseDown?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;

  disabled?: boolean;
  disabledClassName?: string;

  iconStyle?: React.CSSProperties;
  iconLeft?: boolean;
  icon?: string;
  spinner?: boolean;
  spinnerClass?: string;

  buttonRef?: MutableRefObject<HTMLButtonElement | null>;
}

Button.defaultProps = {
  variant: "primary",
  size: "md",
  type: "button",
};

export default function Button(props: ButtonProps) {
  const variantClassName = classNames({
    "text-white bg-primary-500 border border-primary-500":
      props.variant === "primary",
    "text-primary-500 bg-white border-2 border-primary-500":
      props.variant === "reverse-primary",
    "text-black bg-gray-50 hover:bg-gray-100 border border-gray-300 ":
      props.variant === "secondary",
    "text-white bg-gray-600 border-none": props.variant === "tertiary",
    "text-white bg-red-700 border border-transparent":
      props.variant === "danger",
    "bg-[#4285F4] text-white": props.variant === "google",
    "bg-amber-700 text-white": props.variant === "sticky",
    "bg-gray-400 text-white ": props.variant === "lightgray",
    "border-2 border-gray-400 text-gray-400":
      props.variant === "inverse-lightgray",
  });

  //TODO: Add icon not icon styling to rest of sizes, needs extra vertical padding so all buttons are same height
  const sizingClassName = classNames({
    "px-6 py-3 text-xl": props.size === "xl",
    "px-5 py-3 text-lg": props.size === "lg",
    "px-3 py-1.5 text-base": props.size === "md",
    "px-2 py-1 text-sm": props.size === "sm",
    "px-2 py-0.5 text-xs": props.size === "xs" && !props.icon,
    "px-1 text-xs": props.size === "xs" && props.icon,
  });

  const className = classNames({
    "flex-none inline-flex justify-center items-center select-none hover:shadow-none focus:shadow-none rounded-md focus:outline-none font-medium transition ease-in-out duration-150 text-center":
      true,
    "w-full py-2.5": props.fullWidth,
    [sizingClassName]: sizingClassName,
    [variantClassName]: variantClassName,
    "opacity-50 cursor-not-allowed hover:bg-initial": props.disabled,
    [props.disabledClassName || ""]: props.disabled && props.disabledClassName,
    [props.className || ""]: props.className,
  });

  const iconClassName = classNames({
    bx: true,
    "text-3xl": props.size === "xl",
    "text-2xl": props.size === "lg",
    "text-lg": props.size === "md",
    "text-base": props.size === "sm",
    "text-sm": props.size === "xs",
    "mr-3": props.iconLeft && (props.size === "xl" || props.size === "lg"),
    "mr-2": props.iconLeft && props.size === "md",
    "mr-1": props.iconLeft && props.size === "sm",
    // "": props.iconLeft && props.size === "xs",
    "ml-3": !props.iconLeft && (props.size === "xl" || props.size === "lg"),
    "ml-2": !props.iconLeft && props.size === "md",
    "ml-1": !props.iconLeft && props.size === "sm",
    // "": !props.iconLeft && props.size === "xs",
    [props.icon || ""]: props.icon,
  });

  return (
    <button
      type={props.type}
      className={className}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      disabled={props.disabled}
      style={props.style}
      ref={props.buttonRef}
    >
      {props.spinner && (
        <i
          className={`bx bx-loader-alt animate-spin-fast mr-2 ${props.spinnerClass}`}
        />
      )}
      {props.iconLeft && props.icon && (
        <i className={iconClassName} style={props.iconStyle} />
      )}
      {props.children}
      {!props.iconLeft && props.icon && (
        <i className={iconClassName} style={props.iconStyle} />
      )}
    </button>
  );
}
