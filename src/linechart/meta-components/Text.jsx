import React from 'react'

export default function Text({
    fontFamily,
    fontSize,
    fill,
    x,
    y,
    children
}) {
    return (
        <text
            fontFamily={fontFamily}
            fontSize={fontSize}
            fill={fill}
            x={x}
            y={y}
        >
            {children}
        </text>
    )
}