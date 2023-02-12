import React from "react";
import { Control, Controller } from "react-hook-form";
import { clockFormattedToSeconds, secondsToTimerFormat } from "src/utils/time";
import SimpleTimeField from "./SimpleTimeField";
const debug = require("debug")("app:TimerInput");

interface TimerInputProps {
  duration: number;
  control: Control<any, object>;
  name: string;

  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function TimerInput(props: TimerInputProps) {
  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={{ required: props.required }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex flex-col h-6 w-16 bg-white">
          <div className="font-clock inline-block mt-px -mb-6 h-6 w-16 text-center text-base text-gray-200 leading-normal select-none">
            88:88
          </div>
          <div>
            <SimpleTimeField
              value={secondsToTimerFormat(props.duration)}
              onChange={(e, val) => {
                debug("SIMPLE TIME FIELD ARGS", {
                  e,
                  val,
                  clk: clockFormattedToSeconds(val),
                });
                if (!props.disabled) {
                  onChange(clockFormattedToSeconds(val));
                }
              }}
              input={
                <input
                  type="text"
                  className="font-clock inline-block form-input h-6 w-16 text-gray-700 text-center text-base border-none leading-normal bg-transparent p-0"
                />
              }
              disabled={props.disabled}
            />
          </div>
        </div>
      )}
    />
  );
}
