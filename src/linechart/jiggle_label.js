import React from 'react';
import classnames from 'classnames';
import Group from './meta-components/Group'
import { AnnotationCallout } from 'react-annotation'
import moment from 'moment'

export default function JiggleLabel({
  top = 0,
  left = 0,
  className,
  children,
  cx,
  cy,
  r=2.5,
  innerRef,
  config,
  fill="white",
  stroke="steelblue",
  strokeWidth,
  strokeDasharray,
  labelText,
  x,
  y,
  dx=30,
  dy=-30,
  onClick,
  dragEnd,
  note,
  ...restProps
}) {
  return (
      <Group 
        innerRef={innerRef}
        style={restProps.style}
        transform-origin={`${cx} ${cy}`}
        transform={`scale(0)`}
        >
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
        <AnnotationCallout
          className={classnames('vx-glyph-dot', className)}
          x={cx}
          y={cy}
          dx={dx}
          dy={dy}
          color={stroke}
          note={{"title":moment(note.title).format("YYYY년MM월DD일"), "label":note.comment}}
        />
      </Group>
  );
}
