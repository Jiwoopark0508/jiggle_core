import React from 'react'
import { Group } from '@vx/group'

export default function({

    ...restProps
}) {
    return (
        <Group
            className="progress-bar"
        >
            <rect
                x={-60}
                y={40}
                height={20}
                width={30}
                fill={"#6af6af"}
            >
            </rect>
        </Group>
    )
}