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
                fontFamily={"Spoqa Hans"}
                fill={configs.theme.colorPrimary}
                fontWeight={700}
            >
                {configs.title}
            </Text>
            <Text
                y={28}
                fontFamily={"Spoqa Hans"}
                fontWeight={400}
                fill={configs.theme.colorSecondary}
                >
                {configs.subtitle}
            </Text>
        </Group>
    )
}