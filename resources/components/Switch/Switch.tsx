import React, { useState, FC, useMemo, useCallback } from "react";
import classNames from "classnames";

import styles from "./Switch.module.scss";

export interface SwitchOption<T> extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'value'> {
  label: string;
  value: T;
}

export interface SwitchProps<T> {
  id?: string;
  name?: string;
  label?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
  switchClassName?: string;
  hidden?: boolean;
  options: SwitchOption<T>[];
  value?: T;
  onChange?: (value: SwitchOption<T>["value"]) => void;
}

const Switch = <T extends string>(props: SwitchProps<T>) => {
  const {
    label,
    id,
    name,
    className,
    switchClassName,
    options,
    direction,
    onChange,
  } = props;

  const isControlled = useMemo(() => "value" in props, [props]);

  const [value, setValue] = useState<SwitchProps<T>["value"]>(
    (isControlled ? props.value : undefined) || options[0].value
  );

  const currentChecked = useMemo(
    () => (isControlled ? props.value : value) || options[0].value,
    [value, isControlled, props]
  );

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      const newValue = event.currentTarget.dataset.value as T;

      if (!isControlled) {
        setValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [isControlled, onChange]
  );

  return (
    <div
      className={classNames(styles["switch-field"], className, {
        [styles[`input-field--is-${direction}`]]: !!direction,
      })}
      data-app-region="no-drag"
    >
      <label className={styles["switch-label"]} htmlFor={id || name}>
        {label}
      </label>

      <ol
        id={id || name}
        className={classNames(styles["switch"], switchClassName)}
      >
        {options.map(
          ({ label: optionLabel, value: optionValue, ...option }) => (
            <li
              {...option}
              role="button"
              data-value={optionValue}
              onClick={handleChange}
              className={classNames(styles["switch__option"], {
                [styles["switch__option--is-active"]]:
                  currentChecked === optionValue,
              })}
              key={optionValue}
            >
              {optionLabel}
            </li>
          )
        )}
      </ol>
    </div>
  );
};

Switch.displayName = "Switch";

export default Switch;
