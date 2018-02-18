import React from 'react'
import { Group } from '@vx/group'
import { Text } from '@vx/text'

export default function Footer({
    configs,
    top = 28,
    left = 40,
    children
}) {
    console.log(configs)
    return (
        <Group top={configs.height_svg} left={40}>
            <Text
                fontSize={30}
                fontFamily={"Spoqa Hans Bold"}
                fill={configs.colorTernary}
            >
                출 처 - {configs.reference}
            </Text>
            <Text
                y={28}
                fontFamily={"Spoqa Hans Regular"}
                fill={configs.colorTernary}
                >
                만든 이 - {configs.madeBy}
            </Text>
        </Group>
    )
}