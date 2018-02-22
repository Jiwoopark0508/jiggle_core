import React from 'react'
import { Group } from '@vx/group'
import Text from './Text'

export default function Footer({
    configs,
    top = 28,
    left = 40,
    children
}) {
    return (
        <Group>
            <Text
                fontSize={16}
                fontFamily={"Spoqa Hans Bold"}
                fill={configs.colorTernary}
            >
                출처 - {configs.reference}
            </Text>
            <Text
                y={28}
                fontSize={16}
                fontFamily={"Spoqa Hans Bold"}
                fill={configs.colorTernary}
                >
                만든 이 - {configs.madeBy}
            </Text>
        </Group>
    )
}