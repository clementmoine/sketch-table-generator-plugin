import React, { useRef } from "react";
import classNames from "classnames";

import styles from "./Input.module.scss";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  const { className, onKeyDown, type = "text", ...restProps } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      type === "number" &&
      (event.key === "ArrowUp" || event.key === "ArrowDown")
    ) {
      event.preventDefault();
      event.stopPropagation();

      const isIncrement = event.key === "ArrowUp";

      const value = parseFloat(inputRef.current?.value || "0");
      const increment = (isIncrement ? 1 : -1) * (event.shiftKey ? 10 : 1);

      inputRef.current!.value = (value + increment).toString();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  const handleArrowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const isIncrement =
      event.currentTarget.getAttribute("data-action") === "increment";

    const value = parseFloat(inputRef.current?.value || "0");
    const increment = (isIncrement ? 1 : -1) * (event.shiftKey ? 10 : 1);

    inputRef.current!.value = (value + increment).toString();
  };

  return (
    <div className={styles["input-container"]} data-app-region="no-drag">
      <input
        {...restProps}
        ref={inputRef}
        type={type}
        onKeyDown={handleKeyDown}
        className={classNames(styles["input"], className)}
      />

      <div className={classNames(styles["input-addons"], styles["input-addons-left"])}>
        {/* Input number addons */}
        {type === "number" && (
          <div className={styles["input-number-buttons"]}>
            <button
              type="button"
              data-action="decrement"
              onClick={handleArrowClick}
              className={styles["input--type-number-buttons-item"]}
            >
              -
            </button>
            <button
              type="button"
              data-action="increment"
              onClick={handleArrowClick}
              className={styles["input--type-number-buttons-item"]}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Input.displayName = "Input";

export default Input;
