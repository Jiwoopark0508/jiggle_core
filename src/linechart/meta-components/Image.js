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
                            key={`jg-image-${i}`}
                            href={`${d.href}`}
                            height={d.height}
                            width={d.width}
                        />
                    )
                })
            }
        </Group>
    )
}