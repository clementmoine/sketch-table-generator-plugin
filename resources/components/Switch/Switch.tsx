import React, { useState, FC, useMemo, useCallback } from "react";
import classNames from "classnames";

import styles from "./Switch.module.scss";

export interface SwitchOption extends React.LiHTMLAttributes<HTMLLIElement> {
  label: string;
  value: string;
}

export interface SwitchProps {
  id?: string;
  name?: string;
  label?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
  hidden?: boolean;
  options: SwitchOption[];
  value?: SwitchOption["value"];
  onChange?: (value: SwitchProps["value"]) => void;
}

const Switch: FC<SwitchProps> = (props) => {
  const { label, id, name, className, options, onChange } = props;

  const isControlled = useMemo(() => "value" in props, [props]);

  const [value, setValue] = useState<SwitchProps["value"]>(
    (isControlled ? props.value : undefined) || props.options[0].value
  );

  const handleChange = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      const newValue = event.currentTarget.dataset.value;

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
      hidden={props.hidden}
      className={classNames(styles["switch-field"], props.className, {
        [styles[`input-field--is-${props.direction}`]]: !!props.direction,
      })}
      data-app-region="no-drag"
    >
      <label className={styles["switch-label"]} htmlFor={id || name}>
        {label}
      </label>

      <ol id={id || name} className={classNames(styles["switch"], className)}>
        {options.map(
          ({ label: optionLabel, value: optionValue, ...option }) => (
            <li
              {...option}
              role="button"
              data-value={optionValue}
              onClick={handleChange}
              className={classNames(styles["switch__option"], {
                [styles["switch__option--is-active"]]: value === optionValue,
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
