import React from 'react'
import * as d3 from 'd3'

export default class Test extends React.Component { 
    componentDidMount() {
        console.log(d3.select(this.node))
        // d3.select("svg")
        //     .transition()
        //     .duration(750)
    }
    render() {
        return (
            <svg style={
                {
                    width : 300,
                    height : 300,
                    background : "red"
                }}
                ref={
                    (node) => {this.node = node}
                }
            >

            </svg>
        )
    }
}