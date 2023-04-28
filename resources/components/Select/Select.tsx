import React, { useRef } from "react";
import classNames from "classnames";

import styles from "./Select.module.scss";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: React.OptionHTMLAttributes<HTMLOptionElement>[];
}

const Select: React.FC<SelectProps> = (props) => {
  const { className, options, onKeyDown, ...restProps } = props;

  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <select
      {...restProps}
      ref={selectRef}
      data-app-region="no-drag"
      className={classNames(styles["select"], className)}
    >
      {options.map((option, id) => (
        <option key={id} {...option} />
      ))}
    </select>
  );
};

Select.displayName = "Select";

export default Select;
