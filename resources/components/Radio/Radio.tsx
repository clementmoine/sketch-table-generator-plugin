import React from "react";
import { FC } from "react";
import classNames from "classnames";

import styles from "./Radio.module.scss";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  value: string;
}

const Radio: FC<RadioProps> = (props) => {
  const { label, className } = props;

  return (
    <div className={styles["radio-field"]}>
      <input
        {...props}
        type="radio"
        name={props.name}
        id={props.id || props.value}
        className={classNames(styles["radio"], className)}
      />
      <label className={styles["radio-label"]} htmlFor={props.id || props.value}>{label}</label>
    </div>
  );
};

Radio.displayName = "Radio";

export default Radio;
