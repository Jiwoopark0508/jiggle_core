import React from 'react';
import cx from 'classnames';

export default function Group({
  top = 0,
  left = 0,
  className,
  children,
  innerRef,
  ...restProps,
}) {
  return (
    <g
        ref = {innerRef}
        className={cx('cx-group', className)}
        transform={`translate(${left}, ${top})`}
        {...restProps}
    >
        {children}
    </g>
  );
}