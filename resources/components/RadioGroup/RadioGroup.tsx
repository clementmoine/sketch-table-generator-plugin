import React, { useCallback, useMemo, useState } from "react";
import classNames from "classnames";

import Radio, { RadioProps } from "../Radio";

import styles from "./RadioGroup.module.scss";
export interface RadioOption<T> extends Pick<RadioProps, "label"> {
  label: string;
  value: T;
}
export interface RadioGroupProps<T>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string;
  options: RadioOption<T>[];
  value?: RadioProps["value"];
  onChange?: (value: RadioOption<T>["value"]) => void;
}

const RadioGroup = <T extends string>(props: RadioGroupProps<T>) => {
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
    (newValue: T) => {
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
