import React from 'react'
import { Group } from '@vx/group'

export default function Images({
    left = 0,
    top = 0,
    imageList
}) {
    return (
        <Group top={top} left={left}>
            {imageList &&
                imageList.map((d, i) => {
                    return (
                        <image 
                            x={d.x || 0}
                            y={d.y || 0}
                            href={`data:image/png;base64,${d.base64}`}
                            height={d.height}
                            width={d.width}
                        />
                    )
                })
            }
        </Group>
    )
}