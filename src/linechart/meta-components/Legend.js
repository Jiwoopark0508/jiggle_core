import React from 'react'
import { Group } from '@vx/group'
import Text from './Text'

export default function Legend({
    configs,
    left = 0,
    top = 0,
    headers,
    fontSize,
    children
}) {
    headers = headers.slice(1)
    return (
        <Group top={top} left={left}>
            <Text
                fontFamily="Spoqa Hans Bold"
                fontWeight={700}
                fill={configs.theme.colorPrimary}
            >
                단위
            </Text>
            <Group>
                {headers.map((d, i) => {
                    return (
                        <Group
                            key={`jg-legend-${i}`}
                        >
                            <rect
                                fill={configs.graph_colors[i]}
                                y={22 * i + 5}
                                width={20}
                                height={20}
                            ></rect>
                            <Text
                                x={30}
                                y={22 * (i + 1)}
                                fontFamily="Spoqa Hans"
                                fill={configs.theme.colorPrimary}
                            >
                                {d}
                            </Text>
                        </Group>
                    )
                })}
            </Group>
        </Group>
    )
}