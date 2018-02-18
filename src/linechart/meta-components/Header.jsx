import React from 'react'
import { Group } from '@vx/group'
import Text from './Text'

export default function Header({
    configs,
    left = 0,
    top = 0,
    fontSize,
    children
}) {
    return (
        <Group top={top} left={left}>
            <Text
                fontSize={39}
                fontFamily={"Spoqa Hans Bold"}
                fill={configs.colorPrimary}
            >
                {configs.title}
            </Text>
            <Text
                y={28}
                fontFamily={"Spoqa Hans Regular"}
                fill={configs.colorSecondary}
                >
                {configs.subtitle}
            </Text>
        </Group>
    )
}