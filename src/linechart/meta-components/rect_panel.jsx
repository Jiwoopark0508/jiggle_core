import React from 'react';
import { Point } from '@vx/point'

export default function RectPanel({
    from = new Point({ x: 0, y: 0 }),
    to = new Point({ x: 1, y: 1 }),
    width,
    height,
    transform = '',
    className = '',
    innerRef,
    isFill,
    fill = "#f8f8f8",
    ...restProps
}) {
    let backStyle = {
        fill,
    }
    let unbackStyle = {
        fill : "#727272"
    }
    return (
        <rect
            ref={innerRef}
            x={from.x}
            y={from.y}
            width={width}
            height={height}
            style={isFill ? backStyle : unbackStyle}
            transform={transform}
        />
    );
}