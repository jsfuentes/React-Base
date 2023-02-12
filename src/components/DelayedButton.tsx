import classNames from "classnames";
import { motion } from "framer-motion";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Button, {
  ButtonSizeOptions,
  ButtonVariantOptions,
} from "src/components/Button";

const debug = require("debug")("app:DelayedButton");

const BUTTON_DELAY = 0;

interface DelayedButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
  size: ButtonSizeOptions;
  variant: ButtonVariantOptions;
  className?: string;
  disabled?: boolean;
  buttonRef?: MutableRefObject<HTMLButtonElement | null>;
  showProgress?: boolean;
  progressDuration: number;
}

DelayedButton.defaultProps = {
  size: "small",
  variant: "primary",
  progressDuration: 0,
};

export default function DelayedButton(props: DelayedButtonProps) {
  const { onClick, showProgress, progressDuration } = props;
  const [isTicking, setIsTicking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const onClickR = useRef<() => void>();

  useEffect(() => {
    onClickR.current = onClick;
  }, [onClick]);

  useEffect(() => {
    if (isTicking) {
      const timeoutId = setTimeout(async () => {
        setIsUpdating(true);
        onClickR.current && (await onClickR.current());
        setIsTicking(false);
        setIsUpdating(false);
      }, BUTTON_DELAY);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isTicking]);

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        setIsTicking(!isTicking);
      }}
      className={`relative border-none ${props.className}`}
      variant={props.variant}
      size={props.size}
      disabled={isUpdating || props.disabled}
      buttonRef={props.buttonRef}
    >
      {/*<div className="w-full h-full bg-black absolute left-0 top-0" />*/}
      {!isTicking && !isUpdating && showProgress && (
        <motion.div
          className={"absolute left-0 top-0 h-full bg-primary-400"}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: progressDuration, ease: "linear" }}
        />
      )}
      <div className="z-10 flex items-center justify-center">
        {isUpdating ? (
          <div className="flex items-center justify-center">
            <i
              className={classNames({
                "bx bx-loader-alt animate-spin text-xl": true,
                "text-white/50": props.variant === "primary",
                "text-primary-500": props.variant === "reverse-primary",
                "text-gray-800": props.variant === "secondary",
              })}
            />
          </div>
        ) : (
          props.children
        )}
      </div>
    </Button>
  );
}
