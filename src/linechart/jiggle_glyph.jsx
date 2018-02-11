import React from 'react';
import classnames from 'classnames';
import { Group } from '@vx/group'

export default function JiggleGlyph({
  top = 0,
  left = 0,
  className,
  children,
  cx,
  cy,
  r,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
  ...restProps
}) {
  return (
    <Glyph top={top} left={left}>
      <circle
        className={classnames('vx-glyph-dot', className)}
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        {...restProps}
      />
      {children}
    </Glyph>
  );
