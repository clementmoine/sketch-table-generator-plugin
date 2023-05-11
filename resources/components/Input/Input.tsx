import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import styles from "./Input.module.scss";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value?: string;
  inputClassName?: InputProps['className'];
  direction?: "horizontal" | "vertical";
  onChange?: (value: InputProps["value"], select: InputProps) => void;
}

const Input: React.FC<InputProps> = ({initialValue, ...props}) => {
  const [value, setValue] = useState<InputProps["value"]>(props.value|| "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  useEffect(() => {
    if (props.onChange && (props.value || "") != value) {
      props.onChange(value || "", props);
    }
  }, [value]);
  
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (props.type === 'number' && event.target.value == undefined) {
        let value = parseFloat(event.target.value) || 0;

        if (props.max !== undefined) {
          value = Math.min(value, Number(props.max));
        }
  
        if (props.min !== undefined) {
          value = Math.max(value, Number(props.min));
        }

        setValue(value.toString());

        return;
      }

  
      setValue(event.target.value);
    },
    [props.max, props.min]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        props.type === "number" &&
        (event.key === "ArrowUp" || event.key === "ArrowDown")
      ) {
        event.preventDefault();
        event.stopPropagation();

        const isIncrement = event.key === "ArrowUp";

        const currentValue = parseFloat(value || "0");
        const increment = (isIncrement ? 1 : -1) * (event.shiftKey ? 10 : 1);

        let newValue = currentValue + increment;

        if (props.max !== undefined) {
          newValue = Math.min(newValue, Number(props.max));
        }
  
        if (props.min !== undefined) {
          newValue = Math.max(newValue, Number(props.min));
        }

        setValue(newValue.toString());
      }

      if (props.onKeyDown) {
        props.onKeyDown(event);
      }
    },
    [props.type, value, props.onKeyDown, props.max, props.min]
  );

  const handleArrowClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const stepCount = event.shiftKey ? 10 : Number(props.step) || 1;

      if (event.currentTarget.dataset.step === "up") {
        setValue((prevValue) => {
          let newValue = (parseFloat(prevValue || "0") + stepCount);

          if (props.max !== undefined) {
            newValue = Math.min(newValue, Number(props.max));
          }
    
          if (props.min !== undefined) {
            newValue = Math.max(newValue, Number(props.min));
          }

          return newValue.toString();
        });
      } else {
        setValue((prevValue) => {
          let newValue = (parseFloat(prevValue || "0") - stepCount);

          if (props.max !== undefined) {
            newValue = Math.min(newValue, Number(props.max));
          }
    
          if (props.min !== undefined) {
            newValue = Math.max(newValue, Number(props.min));
          }

          return newValue.toString();
        });
      }
    },
    []
  );

  return (
    <div
      hidden={props.hidden}
      className={classNames(styles["input-field"], props.className, {
        [styles[`input-field--is-${props.direction}`]]: !!props.direction,
      })}
      data-app-region="no-drag"
    >
      <label className={styles["input-label"]} htmlFor={props.id || props.name}>
        {props.label}
      </label>

      <div className={styles["input-container"]}>
        <input
          {...props}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          id={props.id || props.name}
          className={classNames(styles["input"], props.inputClassName)}
        />
        <div
          className={classNames(
            styles["input-addons"],
            styles["input-addons-left"]
          )}
        >
          {/* Input number addons */}
          {props.type === "number" && (
            <div className={styles["step-buttons"]}>
              <button type="button" data-step="up" onClick={handleArrowClick}>
                +
              </button>
              <button type="button" data-step="down" onClick={handleArrowClick}>
                -
              </button>
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
