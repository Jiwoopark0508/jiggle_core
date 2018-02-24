import React from 'react';
import cx from 'classnames';
import { Line } from '@vx/shape';
import { Group } from '@vx/group';
import { Point } from '@vx/point';
import RectPanel from './rect_panel'

export default function Columns({
  top = 0,
  left = 0,
  scale,
  height,
  stroke = '#eaf0f6',
  strokeWidth = 1,
  strokeDasharray,
  className,
  numTicks = 10,
  lineStyle,
  ...restProps
}) {
    let ticks = scale.ticks(numTicks);

    return (
        <Group
            className={cx('vx-columns', className)}
            top={top}
            left={left}
        >
        {scale.ticks &&
            scale.ticks(numTicks).map((d, i) => {
                if(i < 1) return;
                let lx = scale(ticks[i - 1]);
                let rx = scale(ticks[i])
                let fromPoint = new Point({
                    x: lx,
                    y: 0,
                });
                let toPoint = new Point({
                    x: rx,
                    y: height,
                });
                return (
                    <RectPanel
                        key={`column-line-${d}-${i}`}
                        from={fromPoint}
                        to={toPoint}
                        width={rx - lx}
                        height={height}
                        isFill={i % 2 == 0}
                        fill={restProps.fill}
                        {...restProps}
                    />
                );
            })}
        </Group>
    );
}