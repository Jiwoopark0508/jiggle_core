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
  innerRef,
  fill,
  stroke,
  strokeWidth,
  strokeDasharray,
  labelText,
  x,
  y,
  dx,
  ...restProps
}) {
  return (
      <Group top={top} left={left}>
        <circle
          ref={innerRef}
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
        <text
            x={cx}
            y={cy}
            dx={dx}
            {...restProps}
            >
            {labelText}
        </text>
        {children}
      </Group>
  );
}
