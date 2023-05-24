import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import styles from "./Select.module.scss";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  value?: string;
  options: React.OptionHTMLAttributes<HTMLOptionElement>[];
  onChange?: (value: SelectProps["value"]) => void;
}

const Select: React.FC<SelectProps> = (props) => {
  const { className, options, label, id, name, onChange, ...restProps } = props;

  const isControlled = useMemo(() => "value" in props, [props]);

  const [value, setValue] = useState<SelectProps["value"]>(
    (isControlled && props.value) || ""
  );

  const currentValue = useMemo(
    () => (isControlled ? props.value : value),
    [isControlled, value, props]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value;

      if (!isControlled) {
        setValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, isControlled]
  );

  return (
    <div className={styles["select-field"]}>
      <label className={styles["select-label"]} htmlFor={id || name}>
        {label}
      </label>

      <select
        {...restProps}
        name={name}
        id={id || name}
        value={currentValue}
        onChange={handleChange}
        data-app-region="no-drag"
        className={classNames(styles["select"], className)}
      >
        {options.map((option, id) => (
          <option key={id} {...option} />
        ))}
      </select>
    </div>
  );
};

Select.displayName = "Select";

export default Select;
