import * as Sentry from "@sentry/react";
import classNames from "classnames";
import conf from "conf";
import React from "react";
import { default as ReactModal, Styles } from "react-modal";

const debug = require("debug")("app:components:Modal");

ReactModal.setAppElement(`#${conf.get("HTML_ROOT_ID")}`);

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  closeModal?: () => void;
  notRounded?: boolean;
  hideX?: boolean;
  title?: React.ReactNode;
  outerContent?: React.ReactNode;
  confirmClose?: boolean;
  animate?: string;
  className?: string;
  overlayClassName?: string;
  style?: Styles;
  shouldCloseOnOverlayClick?: boolean;
  shouldDarkenBackground?: boolean;
  zLevel?: "super" | "max";
  // variant: "prominent" | "soft";
  withPadding: boolean;
}

Modal.defaultProps = {
  shouldCloseOnOverlayClick: true,
  shouldDarkenBackground: true,
  withPadding: true,
  // variant: "prominent",
};

export default function Modal(props: ModalProps) {
  function confirmClose() {
    if (!props.closeModal) {
      Sentry.captureMessage("Trying to close modal without closeModal");
      return;
    }

    if (
      !props.confirmClose ||
      window.confirm("Are you sure you want to close without saving?")
    ) {
      props.closeModal();
    }
  }

  return (
    <ReactModal
      isOpen={props.isOpen}
      onRequestClose={confirmClose}
      className={classNames({
        "modal relative": true,
        "modal-padding": props.withPadding,
        "eta-overflow-y-scroll": true,
        // props.variant === "prominent",
        slideInUp: props.animate === "slide",
        "rounded-none": props.notRounded,
        "rounded-xl": !props.notRounded,
        [props.className || ""]: props.className,
      })}
      overlayClassName={classNames({
        "modal-bg": true,
        "eta-blur-background": props.shouldDarkenBackground,
        "z-super": props.zLevel === "super",
        "z-max": props.zLevel === "max",
        [props.overlayClassName || ""]: !!props.overlayClassName,
      })}
      contentLabel="modal"
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
      style={props.style}
    >
      {props.outerContent}
      {!props.hideX && props.closeModal && (
        <div
          className={classNames({
            "group fixed top-4 left-4 w-10 h-10 rounded-full z-50 flex justify-center items-center bg-white p-1.5 shadow-lg cursor-pointer ":
              true,
            //   props.variant === "prominent",
            // "group absolute top-0 right-0 w-10 h-10 translate-x-1/2 -translate-y-1/2 rounded-full z-50 flex justify-center items-center bg-gray-800 p-1.5 shadow-lg cursor-pointer":
            //   true,
            // props.variant === "soft",
          })}
          onClick={confirmClose} // margins to make it on the top right
        >
          <i
            className={classNames({
              "bx bx-x text-gray-900 text-xl group-hover:text-black": true,
              // props.variant === "prominent",
              // "bx bx-x text-gray-50 bg-gray-800 text-xl": ,
              // props.variant === "soft",
            })}
          />
        </div>
      )}
      <div className="flex flex-col justify-center h-full relative">
        {props.title && (
          <div className="text-2xl font-semibold text-gray-800">
            {props.title}
          </div>
        )}
        {props.children}
      </div>
    </ReactModal>
  );
}
