import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

const Input: FC<InputProps> = (props) => {
  const {
    className,
    type = 'text',
    ...restProps
  } = props;

  return (
    <input
      {...restProps}
      type={type}
      className={classNames(
        styles['input'],
        className
      )}
    />
  );
};

Input.displayName = 'Input';

export default Input;
