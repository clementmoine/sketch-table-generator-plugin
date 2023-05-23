import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";

import styles from "./Select.module.scss";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  options: React.OptionHTMLAttributes<HTMLOptionElement>[];
  onChange?: (
    value: SelectProps['value'],
    select: SelectProps
  ) => void;
}

const Select: React.FC<SelectProps> = ({initialValue, ...props}) => {
  const [value, setValue] = useState<SelectProps["value"]>(props.value || "");

  useEffect(() => {
    setValue(props.value || "");
  }, [props.value]);

  useEffect(() => {
    if (props.onChange && (props.value || "") != value) {
      props.onChange(value || "", props);
    }
  }, [value]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(event.target.value);
    },
    []
  );

  console.log(styles["select"]);

  return (
    <div className={styles["select-field"]}>
      <label
        className={styles["select-label"]}
        htmlFor={props.id || props.name}
      >
        {props.label}
      </label>

      <select
        {...props}
        value={value}
        onChange={handleChange}
        data-app-region="no-drag"
        id={props.id || props.name}
        className={classNames(styles["select"], props.className)}
      >
        {props.options.map((option, id) => (
          <option key={id} {...option} />
        ))}
      </select>
    </div>
  );
};

Select.displayName = "Select";

export default Select;
