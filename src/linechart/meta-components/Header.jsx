import React from 'react'
import { Group } from '@vx/group'
import { Text } from '@vx/text'

export default function Headers({
    main_header = "이곳은 제목이 들어갑니다.",
    sub_header = "이곳은 부제가 들어갑니다.",
    top = 28,
    left = 40,
    children
}) {
    return (
        <Group top={top} left={left}>
            <Text
                fontSize={30}
                fontFamily={"Spoqa Hans Bold"}
            >
                {main_header}
                {children}
            </Text>
            <Text
                y={28}
                fontFamily={"Spoqa Hans Regular"}
                style={{fill : "#4B4949"}}
                >
                {sub_header}
            </Text>
        </Group>
    )
}