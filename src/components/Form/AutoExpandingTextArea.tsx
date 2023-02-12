import classNames from "classnames";
import { useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { getError, getErrorMessage } from "src/components/Form/utils";
import { useRandomId } from "src/utils/hooks";

interface AutoExpandingTextAreaProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  errorPrefix?: string;

  name: string;
  placeholder: string;
  pattern?: RegExp;
  autoFocus?: boolean;
  autoSelect?: boolean;
  disabled?: boolean;
  bottomBorder?: boolean;
  size?: number;
  className?: string;
  textColorCls?: string;
  required?: boolean;
  suppressErrors?: boolean;
}

export default function AutoExpandingTextArea(
  props: AutoExpandingTextAreaProps
) {
  const {
    placeholder,
    name,
    register,
    required,
    pattern,
    errors,
    errorPrefix,
    className,
    autoFocus,
    disabled,
    bottomBorder,
  } = props;

  const id = useRandomId();
  const err = getError(props.errors, name);

  useEffect(() => {
    if (props.autoSelect) {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) {
        input.select();
      }
    }
  }, [id, props.autoSelect]);

  return (
    <>
      <TextareaAutosize
        id={id}
        className={classNames({
          "outline-none-active resize-none bg-transparent overflow-text border-none focus:border-none focus:ring-transparent p-0 outline-none font-medium placeholder-gray-300 flex-shrink-0":
            true,
          "text-black focus:text-black hover:text-gray-800":
            !props.textColorCls,
          [props.textColorCls || ""]: props.textColorCls,
          "border-b pb-[1px] border-gray-200 focus:border-gray-300":
            bottomBorder,
          [className || ""]: className,
        })}
        size={props.size !== undefined ? props.size : undefined}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        autoFocus={autoFocus || false}
        {...register(name, {
          required,
          maxLength: 250,
          pattern: pattern ? pattern : undefined,
        })}
      />
      {err && !props.suppressErrors && (
        <div className="mt-1 text-red-600">{`${
          errorPrefix || ""
        }${getErrorMessage(err)}`}</div>
      )}
    </>
  );
}
