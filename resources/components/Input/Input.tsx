import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import Button from "../Button";

import styles from "./Input.module.scss";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value?: string;
  inputClassName?: InputProps["className"];
  direction?: "horizontal" | "vertical";
  onChange?: (value: InputProps["value"]) => void;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    id,
    min,
    max,
    name,
    type,
    step,
    label,
    onBlur,
    hidden,
    onChange,
    direction,
    className,
    onKeyDown,
    inputClassName,
    ...restProps
  } = props;

  const isControlled = useMemo(() => "value" in props, [props]);

  const [value, setValue] = useState<InputProps["value"]>(
    (isControlled && props.value) || ""
  );

  const currentValue = useMemo(
    () => (isControlled ? props.value : value) || "",
    [props, value, isControlled]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let newValue: string | number = event.target.value;

      if (type === "number" && newValue == undefined) {
        newValue = parseFloat(newValue) || 0;

        if (max !== undefined) {
          newValue = Math.min(newValue, Number(max));
        }

        if (min !== undefined) {
          newValue = Math.max(newValue, Number(min));
        }

        newValue = newValue.toString();
      }

      if (!isControlled) {
        setValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [isControlled, onChange, max, min, type]
  );

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      let newValue: string | number = event.target.value;

      if (type === "number" && newValue == undefined) {
        newValue = parseFloat(newValue) || 0;

        if (max !== undefined) {
          newValue = Math.min(newValue, Number(max));
        }

        if (min !== undefined) {
          newValue = Math.max(newValue, Number(min));
        }

        newValue = newValue.toString();

        if (!isControlled) {
          setValue(newValue);
        }

        if (onChange) {
          onChange(newValue);
        }
      }

      if (onBlur) {
        onBlur(event);
      }
    },
    [isControlled, onBlur, onChange, onBlur, type, max, min]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        type === "number" &&
        (event.key === "ArrowUp" || event.key === "ArrowDown")
      ) {
        event.preventDefault();
        event.stopPropagation();

        let newValue: string | number = event.currentTarget.value;

        const isIncrement = event.key === "ArrowUp";
        const increment =
          (isIncrement ? 1 : -1) * ((event.shiftKey ? 10 : Number(step)) || 1);

        newValue = parseFloat(newValue || "0") + increment;

        if (max !== undefined) {
          newValue = Math.min(newValue, Number(max));
        }

        if (min !== undefined) {
          newValue = Math.max(newValue, Number(min));
        }

        newValue = newValue.toString();

        if (!isControlled) {
          setValue(newValue);
        }

        if (onChange) {
          onChange(newValue);
        }
      }

      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [onChange, isControlled, onKeyDown, type, max, min, step]
  );

  const handleArrowClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      let newValue: string | number = currentValue;

      const isIncrement = event.currentTarget.dataset.step === "up";
      const increment =
        (isIncrement ? 1 : -1) * ((event.shiftKey ? 10 : Number(step)) || 1);

      newValue = parseFloat(newValue || "0") + increment;

      if (max !== undefined) {
        newValue = Math.min(newValue, Number(max));
      }

      if (min !== undefined) {
        newValue = Math.max(newValue, Number(min));
      }

      newValue = newValue.toString();

      if (!isControlled) {
        setValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [isControlled, onChange, currentValue, step, max, min]
  );

  return (
    <div
      hidden={hidden}
      className={classNames(styles["input-field"], className, {
        [styles[`input-field--is-${direction}`]]: !!direction,
      })}
      data-app-region="no-drag"
    >
      <label className={styles["input-label"]} htmlFor={id || name}>
        {label}
      </label>

      <div className={styles["input-container"]}>
        <input
          {...restProps}
          type={type}
          max={max}
          min={min}
          onBlur={handleBlur}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id={id || name}
          name={name}
          step={step}
          className={classNames(styles["input"], inputClassName)}
        />
        <div
          className={classNames(
            styles["input-addons"],
            styles["input-addons-left"]
          )}
        >
          {/* Input number addons */}
          {type === "number" && (
            <div className={styles["step-buttons"]}>
              <Button type="button" data-step="up" onClick={handleArrowClick}>
                +
              </Button>
              <Button type="button" data-step="down" onClick={handleArrowClick}>
                -
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Input.defaultProps = {
  direction: "vertical",
  type: "text",
};

Input.displayName = "Input";

export default Input;
