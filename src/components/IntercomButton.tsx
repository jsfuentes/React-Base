import classNames from "classnames";
import ReactTooltip from "react-tooltip";
import { showIntercom } from "src/utils/analytics/analytics";
import { useRandomId } from "src/utils/hooks";

const debug = require("debug")("app:IntercomButton");

interface IntercomButtonProps {
  variant: "purple" | "black" | "branded" | "primary";
  className: string;
}

IntercomButton.defaultProps = {
  variant: "black",
};

export default function IntercomButton(props: IntercomButtonProps) {
  const id = useRandomId();

  const cls = classNames({
    "w-6 h-6 cursor-pointer transition duration-150 ease-in-out rounded-full flex justify-center items-center":
      true,
    "text-gray-400 bg-gray-800 hover:text-white hover:bg-gray-700":
      props.variant === "black",
    "text-purple-500 bg-purple-50 hover:bg-purple-200":
      props.variant === "purple",
    "text-primary-500 bg-primary-100 hover:bg-primary-400 hover:text-white":
      props.variant === "primary",
    //branded only works if IntercomButton is under EventProvider
    "inverse-branded hover-branded-light-80-color": props.variant === "branded",
    [props.className]: props.className,
  });

  return (
    <div
      onClick={showIntercom}
      className={cls}
      data-for={id}
      data-tip="Support"
      id={id}
    >
      <i className="bx bx-question-mark text-sm" />
      <ReactTooltip
        id={id}
        delayHide={0}
        type="dark"
        effect="solid"
        className="my-tooltip-dark"
        arrowColor="#323232"
      />
    </div>
  );
}
