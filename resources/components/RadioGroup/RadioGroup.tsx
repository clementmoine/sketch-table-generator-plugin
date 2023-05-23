import React, { FC, useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import Radio, { RadioProps } from "../Radio";

import styles from "./RadioGroup.module.scss";

export interface RadioGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string;
  options: Pick<RadioProps, "label" | "value">[];
  value?: RadioProps["value"];
  onChange?: (value: RadioGroupProps["value"]) => void;
}

const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { options, className, onChange } = props;

  const isControlled = useMemo(() => "value" in props, [props]);

  const [value, setValue] = useState(
    () => (isControlled && props.value) || options[0].value
  );

  const currentValue = useMemo(
    () => (isControlled ? props.value : value),
    [isControlled, value, props]
  );

  const handleChange = useCallback(
    (newValue: string) => {
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
    <div className={classNames(styles["radio-group"], className)}>
      {options.map((option) => (
        <Radio
          key={option.value}
          {...option}
          checked={currentValue === option.value}
          onChange={(value) => value && handleChange(option.value)}
        />
      ))}
    </div>
  );
};

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
