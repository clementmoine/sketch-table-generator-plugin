import React, {
  ChangeEventHandler,
  FC,
  useCallback,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";

import styles from "./Radio.module.scss";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  className?: string;
  label: string;
  value: string;
  onChange: (value: RadioProps["checked"]) => void;
}

const Radio: FC<RadioProps> = (props) => {
  const { name, id, value, label, onChange, className, ...restProps } = props;

  const isControlled = useMemo(() => "checked" in props, [props]);

  const [checked, setChecked] = useState<boolean>(
    () => (isControlled && props.checked) || false
  );

  const currentChecked = useMemo(
    () => (isControlled ? props.checked : checked),
    [checked, isControlled, props]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.checked;

      if (!isControlled) {
        setChecked(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, isControlled]
  );

  return (
    <div className={styles["radio-field"]}>
      <input
        {...restProps}
        name={name}
        type="radio"
        id={id || value}
        onChange={handleChange}
        checked={currentChecked}
        className={classNames(styles["radio"], className)}
      />
      <label className={styles["radio-label"]} htmlFor={id || value}>
        {label}
      </label>
    </div>
  );
};

Radio.displayName = "Radio";

export default Radio;
