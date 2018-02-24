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
                fontFamily={"Spoqa Hans"}
                fill={configs.colorTernary}
                fontWeight={700}
            >
                출처 - {configs.reference}
            </Text>
            <Text
                y={28}
                fontSize={16}
                fontFamily={"Spoqa Hans"}
                fontWeight={700}
                fill={configs.colorTernary}
                >
                만든 이 - {configs.madeBy}
            </Text>
        </Group>
    )
}