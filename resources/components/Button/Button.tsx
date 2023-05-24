import React, { FC, useMemo } from "react";
import classNames from "classnames";

import styles from "./Button.module.scss";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    color,
    onClick,
    children,
    className,
    type = "button",
    ...restProps
  } = props;

  const label = useMemo(() => {
    if (restProps.label) {
      return restProps.label;
    }

    if (typeof children === "string") {
      return children;
    }
  }, [children, restProps.label]);

  return (
    <button
      {...restProps}
      type={type}
      onClick={onClick}
      className={classNames(styles["button"], className)}
      data-app-region="no-drag"
    >
      {label}
    </button>
  );
};

Button.displayName = "Button";

export default Button;
