import React from 'react'

export default function Text({
    fontFamily,
    fontSize,
    fill,
    x,
    y,
    children,
    ...restProps
}) {
    return (
        <text
            fontFamily={fontFamily}
            fontSize={fontSize}
            fontWeight={restProps.fontWeight}
            fill={fill}
            x={x}
            y={y}
        >
            {children}
        </text>
    )
}