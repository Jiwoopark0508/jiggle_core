import React from 'react'
import { Group } from '@vx/group'
import * as d3 from 'd3'

export default function JiggleAxis({
    scale,
    group
}) {
    process.nextTick(()=>{
        let selection = d3.select(group._self.domNode)
        let axisBottom = d3.axisBottom(scale)
                            .tickValues([1,2,3,4])
        console.log(selection.call(axisBottom))
    })
    console.log(group._self.domNode)
    
    return <g></g>
}
