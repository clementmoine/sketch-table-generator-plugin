import React from 'react';
import classNames from 'classnames';
import { FC,useMemo } from 'react';

import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    color,
    onClick,
    children,
    className,
    type = 'button',
    ...restProps
  } = props;

  const label = useMemo(() => {
    if (restProps.label) {
      return restProps.label;
    }

    if (typeof children === 'string') {
      return children;
    }
  }, [children, restProps.label]);

  return (
    <button
      {...restProps}
      type={type}
      onClick={onClick}
      className={classNames(
        styles['button'],
        className
      )}
    >
        {label}
    </button>
  );
};

Button.displayName = 'Button';

export default Button;
