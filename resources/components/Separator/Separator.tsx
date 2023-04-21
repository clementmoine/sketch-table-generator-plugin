import React from "react";
import { FC } from "react";
import classNames from "classnames";

import styles from "./Separator.module.scss";

export interface SeparatorProps {
  className?: string;
}

const Separator: FC<SeparatorProps> = (props) => {
  const { className } = props;

  return <div className={classNames(styles["separator"], className)}></div>;
};

Separator.displayName = "Separator";

export default Separator;
