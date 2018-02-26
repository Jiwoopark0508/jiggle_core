import React from 'react'
import { Group } from '@vx/group'

export default function({
    innerRef,
    ...restProps
}) {
    return (
        <Group
            className="progress-bar"
        >
            <rect
                ref={innerRef}
                x={-60}
                y={40}
                height={20}
                width={0}
                fill={"#6af6af"}
            >
            </rect>
        </Group>
    )
}